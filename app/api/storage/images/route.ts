import { NextRequest, NextResponse } from "next/server";

import { getFirebaseAdminAuth } from "@/lib/firebase-admin";
import {
  getSupabaseAdmin,
  supabaseStorageBucket,
} from "@/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FOLDERS = new Set([
  "blog",
  "experience",
  "projects",
  "testimonials",
]);
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/svg+xml", "svg"],
  ["image/webp", "webp"],
]);

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function isAuthorized(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return false;
  }

  const idToken = authorization.slice("Bearer ".length);

  try {
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(idToken);
    const allowedEmails = new Set(
      (process.env.CMS_ADMIN_EMAILS || "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
    );

    if (allowedEmails.size === 0) {
      console.error("CMS_ADMIN_EMAILS is not configured.");
      return false;
    }

    return Boolean(
      decodedToken.email_verified &&
        decodedToken.email &&
        allowedEmails.has(decodedToken.email.toLowerCase())
    );
  } catch (error) {
    console.warn("Rejected image storage request with an invalid token:", error);
    return false;
  }
}

function getSupabaseObjectPath(imageUrl: string) {
  const supabaseUrl = process.env.SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is not configured.");
  }

  const parsedImageUrl = new URL(imageUrl);
  const parsedSupabaseUrl = new URL(supabaseUrl);
  const publicPathPrefix = `/storage/v1/object/public/${supabaseStorageBucket}/`;

  if (
    parsedImageUrl.origin !== parsedSupabaseUrl.origin ||
    !parsedImageUrl.pathname.startsWith(publicPathPrefix)
  ) {
    return null;
  }

  return decodeURIComponent(parsedImageUrl.pathname.slice(publicPathPrefix.length));
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return errorResponse("You are not authorized to upload images.", 403);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      return errorResponse("Choose an image to upload.", 400);
    }

    if (typeof folder !== "string" || !ALLOWED_FOLDERS.has(folder)) {
      return errorResponse("The image destination is invalid.", 400);
    }

    const extension = ALLOWED_IMAGE_TYPES.get(file.type);

    if (!extension) {
      return errorResponse(
        "Only JPEG, PNG, SVG, and WebP images are supported.",
        415
      );
    }

    if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
      return errorResponse("Images must be between 1 byte and 10 MB.", 413);
    }

    const objectPath = `${folder}/${crypto.randomUUID()}.${extension}`;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage
      .from(supabaseStorageBucket)
      .upload(objectPath, await file.arrayBuffer(), {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase image upload failed:", error);
      return errorResponse("The image could not be uploaded.", 502);
    }

    const { data } = supabase.storage
      .from(supabaseStorageBucket)
      .getPublicUrl(objectPath);

    return NextResponse.json({ path: objectPath, url: data.publicUrl });
  } catch (error) {
    console.error("Unexpected image upload failure:", error);
    return errorResponse("Image storage is not configured or unavailable.", 500);
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return errorResponse("You are not authorized to delete images.", 403);
  }

  try {
    const body = (await request.json()) as { imageUrl?: unknown };

    if (typeof body.imageUrl !== "string") {
      return errorResponse("A valid image URL is required.", 400);
    }

    const objectPath = getSupabaseObjectPath(body.imageUrl);

    // Existing Firebase images are deliberately left untouched during migration.
    if (!objectPath) {
      return new NextResponse(null, { status: 204 });
    }

    const { error } = await getSupabaseAdmin()
      .storage.from(supabaseStorageBucket)
      .remove([objectPath]);

    if (error) {
      console.error("Supabase image deletion failed:", error);
      return errorResponse("The image could not be deleted.", 502);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Unexpected image deletion failure:", error);
    return errorResponse("Image storage is not configured or unavailable.", 500);
  }
}
