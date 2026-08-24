"use client";

import { useEffect, useId, useState } from "react";

import {
  BlogPost,
  Company,
  ContactSubmission,
  GridItem,
  NavItem,
  Project,
  SiteSettings,
  Skill,
  SocialLink,
  Testimonial,
  WorkExperience,
} from "@/lib/types";
import { supabase, supabaseStorageBucket } from "@/lib/supabase";

type CollectionName =
  | "projects"
  | "testimonials"
  | "workExperience"
  | "blogPosts"
  | "skills"
  | "contactSubmissions";

type DatabaseRow = Record<string, unknown>;

const collectionTables: Record<CollectionName, string> = {
  projects: "projects",
  testimonials: "testimonials",
  workExperience: "work_experience",
  blogPosts: "blog_posts",
  skills: "skills",
  contactSubmissions: "contact_submissions",
};

const collectionOrderColumns: Record<CollectionName, string> = {
  projects: "display_order",
  testimonials: "display_order",
  workExperience: "display_order",
  blogPosts: "created_at",
  skills: "display_order",
  contactSubmissions: "created_at",
};

const stringValue = (value: unknown) =>
  typeof value === "string" ? value : "";
const numberValue = (value: unknown) =>
  typeof value === "number" ? value : Number(value) || 0;
const booleanValue = (value: unknown) => value === true;
const stringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
const objectArray = <T,>(value: unknown) =>
  (Array.isArray(value) ? value : []) as T[];

function fromDatabaseRow(
  collectionName: CollectionName,
  row: DatabaseRow
): Project | Testimonial | WorkExperience | BlogPost | Skill | ContactSubmission {
  switch (collectionName) {
    case "projects":
      return {
        id: String(row.id),
        title: stringValue(row.title),
        des: stringValue(row.description),
        img: stringValue(row.image_url),
        iconLists: stringArray(row.icon_list),
        link: stringValue(row.link),
        order: numberValue(row.display_order),
        createdAt: stringValue(row.created_at),
      };
    case "testimonials":
      return {
        id: String(row.id),
        quote: stringValue(row.quote),
        name: stringValue(row.name),
        title: stringValue(row.title),
        image: stringValue(row.image_url),
        order: numberValue(row.display_order),
        createdAt: stringValue(row.created_at),
      };
    case "workExperience":
      return {
        id: String(row.id),
        title: stringValue(row.title),
        desc: stringValue(row.description),
        className: stringValue(row.class_name),
        thumbnail: stringValue(row.thumbnail_url),
        order: numberValue(row.display_order),
        createdAt: stringValue(row.created_at),
      };
    case "blogPosts":
      return {
        id: String(row.id),
        title: stringValue(row.title),
        slug: stringValue(row.slug),
        excerpt: stringValue(row.excerpt),
        content: stringValue(row.content),
        coverImage: stringValue(row.cover_image_url),
        tags: stringArray(row.tags),
        published: booleanValue(row.published),
        order: numberValue(row.display_order),
        createdAt: stringValue(row.created_at),
        updatedAt: stringValue(row.updated_at),
      };
    case "skills":
      return {
        id: String(row.id),
        name: stringValue(row.name),
        category: stringValue(row.category) as Skill["category"],
        proficiency: numberValue(row.proficiency),
        icon: stringValue(row.icon),
        order: numberValue(row.display_order),
      };
    case "contactSubmissions":
      return {
        id: String(row.id),
        name: stringValue(row.name),
        email: stringValue(row.email),
        message: stringValue(row.message),
        createdAt: stringValue(row.created_at),
        read: booleanValue(row.read),
      };
  }
}

function compactRow(row: DatabaseRow) {
  return Object.fromEntries(
    Object.entries(row).filter(([, value]) => value !== undefined)
  );
}

function toDatabaseRow(
  collectionName: CollectionName,
  data: Record<string, unknown>
) {
  switch (collectionName) {
    case "projects":
      return compactRow({
        title: data.title,
        description: data.des,
        image_url: data.img,
        icon_list: data.iconLists,
        link: data.link,
        display_order: data.order,
      });
    case "testimonials":
      return compactRow({
        quote: data.quote,
        name: data.name,
        title: data.title,
        image_url: data.image,
        display_order: data.order,
      });
    case "workExperience":
      return compactRow({
        title: data.title,
        description: data.desc,
        class_name: data.className,
        thumbnail_url: data.thumbnail,
        display_order: data.order,
      });
    case "blogPosts":
      return compactRow({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        cover_image_url: data.coverImage,
        tags: data.tags,
        published: data.published,
        display_order: data.order,
      });
    case "skills":
      return compactRow({
        name: data.name,
        category: data.category,
        proficiency: data.proficiency,
        icon: data.icon,
        display_order: data.order,
      });
    case "contactSubmissions":
      return compactRow({
        name: data.name,
        email: data.email,
        message: data.message,
        read: data.read,
      });
  }
}

function errorFromSupabase(error: { message: string } | null) {
  return error ? new Error(error.message) : null;
}

function useSupabaseCollection<T>(
  collectionName: CollectionName,
  publishedOnly = false
): { data: T[]; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionId = useId();

  useEffect(() => {
    let isActive = true;
    const table = collectionTables[collectionName];

    const loadData = async (showLoading = false) => {
      if (showLoading) {
        setLoading(true);
      }

      let request = supabase
        .from(table)
        .select("*")
        .order(collectionOrderColumns[collectionName], {
          ascending:
            collectionName !== "blogPosts" &&
            collectionName !== "contactSubmissions",
        });

      if (collectionName === "blogPosts" && publishedOnly) {
        request = request.eq("published", true);
      }

      const { data: rows, error: queryError } = await request;

      if (!isActive) {
        return;
      }

      if (queryError) {
        console.error(`Error fetching ${table}:`, queryError);
        setError(errorFromSupabase(queryError));
      } else {
        setData(
          (rows || []).map((row) =>
            fromDatabaseRow(collectionName, row as DatabaseRow)
          ) as T[]
        );
        setError(null);
      }

      setLoading(false);
    };

    void loadData(true);

    const channel = supabase
      .channel(
        `portfolio:${table}:${publishedOnly ? "published" : "all"}:${subscriptionId}`
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => void loadData()
      )
      .subscribe();

    return () => {
      isActive = false;
      void supabase.removeChannel(channel);
    };
  }, [collectionName, publishedOnly, subscriptionId]);

  return { data, loading, error };
}

export function useProjects() {
  return useSupabaseCollection<Project>("projects");
}

export function useTestimonials() {
  return useSupabaseCollection<Testimonial>("testimonials");
}

export function useExperience() {
  return useSupabaseCollection<WorkExperience>("workExperience");
}

export function useBlogPosts(publishedOnly = true) {
  return useSupabaseCollection<BlogPost>("blogPosts", publishedOnly);
}

export function useSkills() {
  return useSupabaseCollection<Skill>("skills");
}

export function useContactSubmissions() {
  return useSupabaseCollection<ContactSubmission>("contactSubmissions");
}

export function useSiteSettings() {
  const [data, setData] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionId = useId();

  useEffect(() => {
    let isActive = true;

    const loadSettings = async () => {
      const { data: row, error: queryError } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "main")
        .maybeSingle();

      if (!isActive) {
        return;
      }

      if (queryError) {
        console.error("Error fetching site settings:", queryError);
        setError(errorFromSupabase(queryError));
      } else if (row) {
        setData({
          navItems: objectArray<NavItem>(row.nav_items),
          socialMedia: objectArray<SocialLink>(row.social_media),
          gridItems: objectArray<GridItem>(row.grid_items),
          companies: objectArray<Company>(row.companies),
          email: stringValue(row.email),
          resumeUrl: stringValue(row.resume_url),
          aboutText: stringValue(row.about_text),
          heroTagline: stringValue(row.hero_tagline),
          heroSubtitle: stringValue(row.hero_subtitle),
        });
        setError(null);
      }

      setLoading(false);
    };

    void loadSettings();

    const channel = supabase
      .channel(`portfolio:site_settings:${subscriptionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
          filter: "id=eq.main",
        },
        () => void loadSettings()
      )
      .subscribe();

    return () => {
      isActive = false;
      void supabase.removeChannel(channel);
    };
  }, [subscriptionId]);

  return { data, loading, error };
}

export async function addDocument<T extends Record<string, unknown>>(
  collectionName: CollectionName,
  data: Omit<T, "id" | "createdAt">
): Promise<string> {
  const { data: inserted, error } = await supabase
    .from(collectionTables[collectionName])
    .insert(toDatabaseRow(collectionName, data))
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return String(inserted.id);
}

export async function updateDocument(
  collectionName: CollectionName,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase
    .from(collectionTables[collectionName])
    .update(toDatabaseRow(collectionName, data))
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteDocument(
  collectionName: CollectionName,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from(collectionTables[collectionName])
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getDocument<T>(
  collectionName: CollectionName,
  id: string
): Promise<T | null> {
  const { data, error } = await supabase
    .from(collectionTables[collectionName])
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data
    ? (fromDatabaseRow(collectionName, data as DatabaseRow) as T)
    : null;
}

export async function getPublishedBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data
    ? (fromDatabaseRow("blogPosts", data as DatabaseRow) as BlogPost)
    : null;
}

export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<void> {
  const row = compactRow({
    id: "main",
    nav_items: settings.navItems,
    social_media: settings.socialMedia,
    grid_items: settings.gridItems,
    companies: settings.companies,
    email: settings.email,
    resume_url: settings.resumeUrl,
    about_text: settings.aboutText,
    hero_tagline: settings.heroTagline,
    hero_subtitle: settings.heroSubtitle,
  });
  const { error } = await supabase
    .from("site_settings")
    .upsert(row, { onConflict: "id" });

  if (error) {
    throw new Error(error.message);
  }
}

const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/svg+xml", "svg"],
  ["image/webp", "webp"],
]);

export async function uploadImage(file: File, folder: string): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    throw new Error("You must be signed in to upload images.");
  }

  const extension = allowedImageTypes.get(file.type);

  if (!extension) {
    throw new Error("Only JPEG, PNG, SVG, and WebP images are supported.");
  }

  if (file.size === 0 || file.size > 10 * 1024 * 1024) {
    throw new Error("Images must be between 1 byte and 10 MB.");
  }

  const objectPath = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(supabaseStorageBucket)
    .upload(objectPath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return supabase.storage
    .from(supabaseStorageBucket)
    .getPublicUrl(objectPath).data.publicUrl;
}

export async function deleteImage(imageUrl: string): Promise<void> {
  const parsedUrl = new URL(imageUrl);
  const publicPathPrefix = `/storage/v1/object/public/${supabaseStorageBucket}/`;

  if (
    parsedUrl.origin !== new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
        "https://melvkemjdoluueaunvkn.supabase.co"
    ).origin ||
    !parsedUrl.pathname.startsWith(publicPathPrefix)
  ) {
    return;
  }

  const objectPath = decodeURIComponent(
    parsedUrl.pathname.slice(publicPathPrefix.length)
  );
  const { error } = await supabase.storage
    .from(supabaseStorageBucket)
    .remove([objectPath]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function submitContactForm(
  name: string,
  email: string,
  message: string
): Promise<void> {
  const { error } = await supabase
    .from("contact_submissions")
    .insert({ name, email, message, read: false });

  if (error) {
    throw new Error(error.message);
  }
}
