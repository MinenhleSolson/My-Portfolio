import "server-only";

import { getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export function getFirebaseAdminAuth() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const app =
    getApps().length > 0
      ? getApp()
      : initializeApp(projectId ? { projectId } : undefined);

  return getAuth(app);
}
