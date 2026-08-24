-- Supabase owns authentication, portfolio data, realtime updates, and images.
-- Firebase remains the deployment host only.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 200),
  description text not null default '',
  image_url text not null default '',
  icon_list text[] not null default '{}',
  link text not null default '',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id bigint generated always as identity primary key,
  quote text not null check (char_length(quote) between 1 and 2000),
  name text not null check (char_length(name) between 1 and 200),
  title text not null default '',
  image_url text not null default '',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_experience (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 200),
  description text not null default '',
  class_name text not null default 'md:col-span-2',
  thumbnail_url text not null default '',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 250),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text not null default '',
  tags text[] not null default '{}',
  published boolean not null default false,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 100),
  category text not null check (category in ('frontend', 'backend', 'tools', 'other')),
  proficiency integer not null check (proficiency between 0 and 100),
  icon text not null default '',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'main' check (id = 'main'),
  nav_items jsonb not null default '[]'::jsonb,
  social_media jsonb not null default '[]'::jsonb,
  grid_items jsonb not null default '[]'::jsonb,
  companies jsonb not null default '[]'::jsonb,
  email text not null default '',
  resume_url text not null default '',
  about_text text not null default '',
  hero_tagline text not null default '',
  hero_subtitle text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_submissions (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) <= 320 and position('@' in email) > 1),
  message text not null check (char_length(message) between 1 and 5000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists projects_display_order_idx
  on public.projects (display_order);
create index if not exists testimonials_display_order_idx
  on public.testimonials (display_order);
create index if not exists work_experience_display_order_idx
  on public.work_experience (display_order);
create index if not exists skills_display_order_idx
  on public.skills (display_order);
create index if not exists blog_posts_published_created_at_idx
  on public.blog_posts (created_at desc)
  where published = true;
create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Seed the portfolio's current static content once so adding the next CMS item
-- does not hide the existing fallback projects, testimonials, experience, or skills.
insert into public.projects (
  title, description, image_url, icon_list, link, display_order
)
select seed.*
from (
  values
    (
      'Product Showcasing Website',
      'A website that showcase available products for sale.',
      '/something_spicy.svg',
      array['/tail.svg', '/next.svg', '/ts.svg', '/firebase.svg']::text[],
      'https://somethingspicy.co.za/',
      0
    ),
    (
      'Dynamic Musician Portfolio',
      'Features music/video players, booking form, and a CMS for easy content updates.',
      '/musician.png',
      array['/tail.svg', '/next.svg', '/ts.svg', '/firebase.svg']::text[],
      'https://master-m101.vercel.app/',
      1
    )
) as seed(title, description, image_url, icon_list, link, display_order)
where not exists (select 1 from public.projects);

insert into public.testimonials (
  quote, name, title, image_url, display_order
)
select seed.*
from (
  values
    (
      'Minenhle turned our dream into reality. We are thrilled with our professional, easy-to-navigate website. His customer service was excellent, he paid attention to every detail, was always available, and punctual. We highly recommend him for a modern, professional website.',
      'Sandile Cele',
      'CEO & Co-Founder of Something Spicy SA',
      '/Sandile.jpg',
      0
    ),
    (
      'Very pleased with the new website. It is exactly what I was looking for. Thank you for your excellent work!',
      'Mthokozisi ''Master M'' Chiliza',
      'Musician',
      '/master.png',
      1
    )
) as seed(quote, name, title, image_url, display_order)
where not exists (select 1 from public.testimonials);

insert into public.work_experience (
  title, description, class_name, thumbnail_url, display_order
)
select seed.*
from (
  values
    (
      'Full-Stack Engineer',
      'I built a fully functional auction marketplace platform with real-time rendering, from concept to deployment.',
      'md:col-span-2',
      '/exp1.svg',
      0
    ),
    (
      'Freelance App Dev Project',
      'I independently led the development of a website for a client, completing the project in less than a week and earning a perfect 5-star rating for the work.',
      'md:col-span-2',
      '/exp3.svg',
      1
    )
) as seed(title, description, class_name, thumbnail_url, display_order)
where not exists (select 1 from public.work_experience);

insert into public.skills (
  name, category, proficiency, icon, display_order
)
select seed.*
from (
  values
    ('React', 'frontend', 95, '/react.svg', 0),
    ('Next.js', 'frontend', 90, '/next.svg', 1),
    ('TypeScript', 'frontend', 88, '/ts.svg', 2),
    ('JavaScript', 'frontend', 95, '/javascript.svg', 3),
    ('Tailwind CSS', 'frontend', 92, '/tail.svg', 4),
    ('Node.js', 'backend', 85, '/node.svg', 0),
    ('MongoDB', 'backend', 80, '/mongodb.svg', 1),
    ('Firebase', 'backend', 88, '/firebase.svg', 2),
    ('GraphQL', 'backend', 75, '/graphql.svg', 3),
    ('PHP/Laravel', 'backend', 78, '/laravel.svg', 4),
    ('Git', 'tools', 90, '/git.svg', 0),
    ('Three.js', 'tools', 70, '/three.svg', 1),
    ('Framer Motion', 'tools', 85, '/fm.svg', 2)
) as seed(name, category, proficiency, icon, display_order)
where not exists (select 1 from public.skills);

insert into public.site_settings (
  id,
  nav_items,
  social_media,
  grid_items,
  companies,
  hero_tagline,
  hero_subtitle
)
values (
  'main',
  $json$[
    {"name":"About","link":"#about"},
    {"name":"Projects","link":"#projects"},
    {"name":"Blog","link":"#blog"},
    {"name":"Testimonials","link":"#testimonials"},
    {"name":"Contact","link":"#contact"}
  ]$json$::jsonb,
  $json$[
    {"id":1,"img":"/git.svg","link":"https://github.com/MinenhleSolson"},
    {"id":2,"img":"/twit.svg","link":"https://x.com/minenhle_cele_"},
    {"id":3,"img":"/link.svg","link":"https://www.linkedin.com/in/minenhle-solson-cele/"}
  ]$json$::jsonb,
  $json$[
    {"id":1,"title":"Delivering high-quality, user-friendly applications with efficient communication skills.","description":"","className":"lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]","imgClassName":"w-full h-full","titleClassName":"justify-end","img":"/b1.svg","spareImg":""},
    {"id":2,"title":"I'm very flexible with Time Zone Communications","description":"","className":"lg:col-span-2 md:col-span-3 md:row-span-2","imgClassName":"","titleClassName":"justify-start","img":"","spareImg":""},
    {"id":3,"title":"My Tech Stack","description":"I Constantly Try To Improve","className":"lg:col-span-2 md:col-span-3 md:row-span-2","imgClassName":"","titleClassName":"justify-center","img":"","spareImg":""},
    {"id":4,"title":"Tech Enthusiast Driven by a Passion for Development.","description":"","className":"lg:col-span-2 md:col-span-3 md:row-span-1","imgClassName":"","titleClassName":"justify-start","img":"/grid.svg","spareImg":"/b4.svg"},
    {"id":5,"title":"Currently Developing a Product Showcase Website.","description":"The Inside Scoop","className":"md:col-span-3 md:row-span-2","imgClassName":"absolute right-0 bottom-0 md:w-96 w-60","titleClassName":"justify-center md:justify-start lg:justify-center","img":"/b5.svg","spareImg":"/grid.svg"},
    {"id":6,"title":"Do You Want To Start a Project Together?","description":"","className":"lg:col-span-2 md:col-span-3 md:row-span-1","imgClassName":"","titleClassName":"justify-center md:max-w-full max-w-60 text-center","img":"","spareImg":""}
  ]$json$::jsonb,
  '[]'::jsonb,
  'Transforming Ideas into Engaging User Experiences',
  'Hi! I''m Minenhle, a Developer based in South Africa.'
)
on conflict (id) do nothing;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

drop trigger if exists work_experience_set_updated_at on public.work_experience;
create trigger work_experience_set_updated_at
before update on public.work_experience
for each row execute function public.set_updated_at();

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

drop trigger if exists skills_set_updated_at on public.skills;
create trigger skills_set_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.testimonials enable row level security;
alter table public.work_experience enable row level security;
alter table public.blog_posts enable row level security;
alter table public.skills enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_submissions enable row level security;

revoke all on public.admin_users from anon, authenticated;
revoke all on public.projects from anon, authenticated;
revoke all on public.testimonials from anon, authenticated;
revoke all on public.work_experience from anon, authenticated;
revoke all on public.blog_posts from anon, authenticated;
revoke all on public.skills from anon, authenticated;
revoke all on public.site_settings from anon, authenticated;
revoke all on public.contact_submissions from anon, authenticated;

grant select on public.admin_users to authenticated;
grant select on public.projects, public.testimonials, public.work_experience,
  public.skills, public.site_settings to anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.projects, public.testimonials,
  public.work_experience, public.blog_posts, public.skills to authenticated;
grant insert, update on public.site_settings to authenticated;
grant insert on public.contact_submissions to anon, authenticated;
grant select, update, delete on public.contact_submissions to authenticated;

grant usage, select on sequence public.projects_id_seq,
  public.testimonials_id_seq, public.work_experience_id_seq,
  public.blog_posts_id_seq, public.skills_id_seq to authenticated;
grant usage, select on sequence public.contact_submissions_id_seq
  to anon, authenticated;

drop policy if exists "Users can read their admin membership" on public.admin_users;
create policy "Users can read their admin membership"
on public.admin_users for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
on public.projects for select to anon, authenticated using (true);
drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects"
on public.projects for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Public can read testimonials" on public.testimonials;
create policy "Public can read testimonials"
on public.testimonials for select to anon, authenticated using (true);
drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials"
on public.testimonials for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Public can read work experience" on public.work_experience;
create policy "Public can read work experience"
on public.work_experience for select to anon, authenticated using (true);
drop policy if exists "Admins manage work experience" on public.work_experience;
create policy "Admins manage work experience"
on public.work_experience for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
on public.blog_posts for select to anon, authenticated
using (published = true);
drop policy if exists "Admins manage blog posts" on public.blog_posts;
create policy "Admins manage blog posts"
on public.blog_posts for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Public can read skills" on public.skills;
create policy "Public can read skills"
on public.skills for select to anon, authenticated using (true);
drop policy if exists "Admins manage skills" on public.skills;
create policy "Admins manage skills"
on public.skills for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
on public.site_settings for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Anyone can submit the contact form" on public.contact_submissions;
create policy "Anyone can submit the contact form"
on public.contact_submissions for insert to anon, authenticated
with check (read = false);
drop policy if exists "Admins manage contact submissions" on public.contact_submissions;
create policy "Admins manage contact submissions"
on public.contact_submissions for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins upload portfolio images" on storage.objects;
create policy "Admins upload portfolio images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'portfolio-images'
  and (select public.is_admin())
);

drop policy if exists "Admins update portfolio images" on storage.objects;
create policy "Admins update portfolio images"
on storage.objects for update to authenticated
using (
  bucket_id = 'portfolio-images'
  and (select public.is_admin())
)
with check (
  bucket_id = 'portfolio-images'
  and (select public.is_admin())
);

drop policy if exists "Admins delete portfolio images" on storage.objects;
create policy "Admins delete portfolio images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'portfolio-images'
  and (select public.is_admin())
);

do $$
declare
  realtime_table text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach realtime_table in array array[
      'projects',
      'testimonials',
      'work_experience',
      'blog_posts',
      'skills',
      'site_settings',
      'contact_submissions'
    ]
    loop
      if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = realtime_table
      ) then
        execute format(
          'alter publication supabase_realtime add table public.%I',
          realtime_table
        );
      end if;
    end loop;
  end if;
end;
$$;
