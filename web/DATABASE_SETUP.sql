-- =====================================================================
--  HIMADISTIK — Setup Database Supabase
--  =====================================================================
--  INSTRUKSI:
--  1. Pergi ke: https://supabase.com
--  2. Login, pilih project, klik SQL Editor di sidebar
--  3. Klik "+ New query"
--  4. Copy-paste SELURUH FILE INI
--  5. GANTI 'GANTI_DENGAN_EMAIL_ADMIN@gmail.com' dengan email Anda!
--  6. Klik tombol RUN (atau Ctrl+Enter)
--  7. Tunggu sampai selesai ✅
-- =====================================================================


-- ========== BAGIAN 1: DAFTAR ADMIN ==========
-- Hanya email di tabel ini yang boleh mengubah data website.
-- GANTI EMAIL INI DENGAN EMAIL ANDA!

create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

insert into public.admins (email)
values ('GANTI_DENGAN_EMAIL_ADMIN@gmail.com')
on conflict (email) do nothing;

-- Fungsi untuk check apakah user adalah admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;


-- ========== BAGIAN 2: KRITIK & SARAN ==========
-- Pengunjung hanya bisa kirim. Admin bisa baca/ubah/hapus.

create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category   text not null default 'Saran'
             check (category in ('Kritik', 'Saran', 'Aspirasi', 'Pertanyaan')),
  name       text check (name    is null or char_length(name)    <= 100),
  contact    text check (contact is null or char_length(contact) <= 150),
  message    text not null check (char_length(btrim(message)) between 5 and 2000),
  anonymous  boolean not null default false,
  is_read    boolean not null default false
);
alter table public.feedback enable row level security;

grant usage on schema public to anon, authenticated;
grant insert                         on public.feedback to anon;
grant select, insert, update, delete on public.feedback to authenticated;

drop policy if exists feedback_insert_public on public.feedback;
create policy feedback_insert_public on public.feedback
  for insert to anon, authenticated
  with check (is_read = false);

drop policy if exists feedback_select_admin on public.feedback;
create policy feedback_select_admin on public.feedback
  for select to authenticated using (public.is_admin());

drop policy if exists feedback_update_admin on public.feedback;
create policy feedback_update_admin on public.feedback
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists feedback_delete_admin on public.feedback;
create policy feedback_delete_admin on public.feedback
  for delete to authenticated using (public.is_admin());


-- ========== BAGIAN 3: KONTEN WEBSITE YANG BISA DIEDIT ==========
-- Program kerja, FAQ, Struktur organisasi, Cabinet
-- Publik bisa baca, admin bisa ubah

create table if not exists public.site_content (
  key        text primary key
             check (key in ('programs', 'faqs', 'struktur', 'cabinets')),
  value      jsonb not null check (octet_length(value::text) <= 500000),
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table public.site_content enable row level security;

grant select                         on public.site_content to anon;
grant select, insert, update, delete on public.site_content to authenticated;

-- Trigger: updated_at & updated_by diisi otomatis (tidak bisa dipalsukan)
create or replace function public.touch_site_content()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.jwt() ->> 'email';
  return new;
end;
$$;
drop trigger if exists trg_touch_site_content on public.site_content;
create trigger trg_touch_site_content
  before insert or update on public.site_content
  for each row execute function public.touch_site_content();

-- RLS Policies
drop policy if exists site_content_read on public.site_content;
create policy site_content_read on public.site_content
  for select to anon, authenticated using (true);

drop policy if exists site_content_insert_admin on public.site_content;
create policy site_content_insert_admin on public.site_content
  for insert to authenticated with check (public.is_admin());

drop policy if exists site_content_update_admin on public.site_content;
create policy site_content_update_admin on public.site_content
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists site_content_delete_admin on public.site_content;
create policy site_content_delete_admin on public.site_content
  for delete to authenticated using (public.is_admin());


-- ========== BAGIAN 4: STORAGE UNTUK FOTO DOKUMENTASI ==========
-- Publik tidak bisa upload, hanya bisa lihat foto.
-- Admin bisa upload dan hapus.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('dokumentasi', 'dokumentasi', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists dokumentasi_select_admin on storage.objects;
create policy dokumentasi_select_admin on storage.objects
  for select to authenticated
  using (bucket_id = 'dokumentasi' and public.is_admin());

drop policy if exists dokumentasi_insert_admin on storage.objects;
create policy dokumentasi_insert_admin on storage.objects
  for insert to authenticated
  with check (bucket_id = 'dokumentasi' and public.is_admin());

drop policy if exists dokumentasi_delete_admin on storage.objects;
create policy dokumentasi_delete_admin on storage.objects
  for delete to authenticated
  using (bucket_id = 'dokumentasi' and public.is_admin());


-- ========== VERIFIKASI ==========
-- Setelah Run, Anda harus melihat:
-- 1. Tabel "admins" dengan 1 row (email Anda)
-- 2. Tabel "feedback" (kosong)
-- 3. Tabel "site_content" (kosong)
-- 4. Storage bucket "dokumentasi"

select '✅ Setup selesai! Email admin:' as status, email from public.admins;
