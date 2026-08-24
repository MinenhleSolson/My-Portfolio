# Minenhle's Portfolio

Firebase Hosting serves a static export of the Next.js application at
`https://minenhle-cele.web.app`. Supabase owns all runtime application services:

- Supabase Auth for CMS email/password login
- Supabase Postgres for portfolio and CMS data
- Supabase Realtime for live CMS/site refreshes
- Supabase Storage for uploaded images

No Firebase Auth, Firestore, or Firebase Storage SDK is used by the app.

## One-time Supabase setup

### 1. Create the schema and security policies

Open **Supabase Dashboard > SQL Editor**, paste the contents of
`supabase/migrations/20260824000000_initial_portfolio.sql`, and run it.

The migration creates the portfolio tables, indexes, Realtime publication
entries, least-privilege grants, and Row Level Security policies. Public visitors
can read portfolio content and submit the contact form. Only a user listed in
`admin_users` can use CMS write operations or manage images.

### 2. Create the image bucket

Open **Storage > New bucket** and create `portfolio-images` with:

- Public bucket: enabled
- Maximum file size: 10 MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/svg+xml`, `image/webp`

Public access applies only to viewing images. The migration's Storage RLS
policies restrict uploads, updates, and deletion to administrators.

### 3. Create the CMS administrator

Open **Authentication > Users > Add user** and create your email/password user.
Copy its UUID, then run this in the SQL Editor with your real values:

```sql
insert into public.admin_users (user_id, email)
values ('YOUR_AUTH_USER_UUID', 'YOUR_EMAIL_ADDRESS');
```

The CMS intentionally has no public signup and no Google login.

## Configuration

The Supabase project URL and anonymous/publishable key are public client
configuration. Security is enforced by Supabase Auth, grants, and RLS. No
Supabase service-role key is required by this application.

For local development, copy `.env.example` to `.env.local` and insert the same
anonymous/publishable key.

## Firebase Hosting deployment

`npm run build` exports the site to `out/`. `firebase.json` deploys that folder
to the classic Firebase Hosting site `minenhle-cele`; App Hosting is not used.

For a manual deployment, authenticate the Firebase CLI with
`minenhlecele34@gmail.com`, then run:

```bash
npm run deploy
```

The workflows in `.github/workflows/` build pull-request previews and deploy
every push to `main`. They require this GitHub Actions secret:

```text
FIREBASE_SERVICE_ACCOUNT_MINENHLE_CELE
```

Run `firebase init hosting:github` once while authenticated with the correct
Firebase account to create the least-privilege service account and upload that
secret to `MinenhleSolson/My-Portfolio`.
