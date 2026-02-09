"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  where,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import {
  Project,
  Testimonial,
  WorkExperience,
  BlogPost,
  Skill,
  SiteSettings,
  ContactSubmission,
} from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

// ============ Generic Collection Hook ============
function useFirestoreCollection<T>(
  collectionName: string,
  orderField: string = "order"
): { data: T[]; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      orderBy(orderField, "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, orderField]);

  return { data, loading, error };
}

// ============ Projects Hook ============
export function useProjects() {
  return useFirestoreCollection<Project>("projects", "order");
}

// ============ Testimonials Hook ============
export function useTestimonials() {
  return useFirestoreCollection<Testimonial>("testimonials", "order");
}

// ============ Work Experience Hook ============
export function useExperience() {
  return useFirestoreCollection<WorkExperience>("workExperience", "order");
}

// ============ Blog Posts Hook ============
export function useBlogPosts(publishedOnly: boolean = true) {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch all posts first, then filter client-side to avoid needing a composite index
    const q = query(collection(db, "blogPosts"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BlogPost[];
        
        // Filter published posts client-side if needed
        if (publishedOnly) {
          items = items.filter((post) => post.published === true);
        }
        
        // Sort by createdAt descending (newest first)
        items.sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0;
          const dateB = b.createdAt?.toMillis?.() || 0;
          return dateB - dateA;
        });
        
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching blog posts:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [publishedOnly]);

  return { data, loading, error };
}

// ============ Skills Hook ============
export function useSkills() {
  return useFirestoreCollection<Skill>("skills", "order");
}

// ============ Site Settings Hook ============
export function useSiteSettings() {
  const [data, setData] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "siteSettings", "main"),
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.data() as SiteSettings);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching site settings:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { data, loading, error };
}

// ============ Contact Submissions Hook ============
export function useContactSubmissions() {
  return useFirestoreCollection<ContactSubmission>("contactSubmissions", "createdAt");
}

// ============ CRUD Operations ============

// Add document
export async function addDocument<T extends Record<string, any>>(
  collectionName: string,
  data: Omit<T, "id" | "createdAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// Update document
export async function updateDocument(
  collectionName: string,
  id: string,
  data: Record<string, any>
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
}

// Delete document
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  await deleteDoc(doc(db, collectionName, id));
}

// Get single document
export async function getDocument<T>(
  collectionName: string,
  id: string
): Promise<T | null> {
  const docSnap = await getDoc(doc(db, collectionName, id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

// ============ Site Settings Operations ============
export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<void> {
  await setDoc(doc(db, "siteSettings", "main"), settings, { merge: true });
}

// ============ Image Upload ============
export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  const fileName = `${uuidv4()}-${file.name}`;
  const storageRef = ref(storage, `${path}/${fileName}`);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}

// Delete image
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}

// ============ Contact Form Submission ============
export async function submitContactForm(
  name: string,
  email: string,
  message: string
): Promise<string> {
  const docRef = await addDoc(collection(db, "contactSubmissions"), {
    name,
    email,
    message,
    createdAt: Timestamp.now(),
    read: false,
  });
  return docRef.id;
}
