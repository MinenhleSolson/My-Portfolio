# Minenhle's Portfolio

## Supabase image storage

The CMS keeps its structured content in Firebase/Firestore and stores uploaded
project, blog, testimonial, and experience images in Supabase Storage.

1. In the Supabase project `melvkemjdoluueaunvkn`, create a **public** bucket
   named `portfolio-images`.
2. Allow JPEG, PNG, SVG, and WebP files and set the bucket file-size limit to
   at least 10 MB.
3. Copy the Supabase service-role/secret key from **Project Settings > API**.
   Do not put it in this repository or expose it with a `NEXT_PUBLIC_` name.
4. Add it to Firebase App Hosting's Secret Manager integration:

   ```bash
   firebase apphosting:secrets:set SUPABASE_SERVICE_ROLE_KEY
   ```

5. Add the comma-separated Firebase Auth email addresses allowed to upload and
   delete images as a second runtime secret:

   ```bash
   firebase apphosting:secrets:set CMS_ADMIN_EMAILS
   ```

Grant the App Hosting backend access when prompted. The checked-in
`apphosting.yaml` already maps both secrets into the server runtime. The upload
API fails closed if `CMS_ADMIN_EMAILS` is missing or the signed-in user's
verified email is not in the list.

For local development, copy `.env.example` to `.env.local` and supply the
service-role key there. Firebase Admin uses Application Default Credentials in
Firebase App Hosting. Local image-upload testing additionally requires Google
Application Default Credentials for the Firebase project.

Existing Firebase Storage URLs remain valid and are not migrated or deleted.
Any image uploaded after this change is saved in Supabase, and its public URL is
stored in the existing Firestore document.
