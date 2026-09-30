-- =====================================================================
--  HIMADISTIK — Setup database Supabase
--  Cara pakai: Supabase Dashboard → SQL Editor → New query → tempel
--  seluruh isi file ini → Run. Aman dijalankan ulang (idempotent).
--
--  WAJIB: ganti email di BAGIAN 1 dengan email admin yang sebenarnya.
-- =====================================================================


-- ---------------------------------------------------------------------
-- BAGIAN 1 — Daftar admin
-- Hanya email di tabel ini yang boleh mengubah data. Akun Supabase Auth
-- saja TIDAK cukup. Tabel ini tidak bisa dibaca lewat API (RLS aktif
-- tanpa policy); hanya fungsi is_admin() yang bisa memeriksanya.
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

insert into public.admins (email)
values ('GANTI_DENGAN_EMAIL_ADMIN@gmail.com')      -- <<< GANTI INI
on conflict (email) do nothing;
-- Tambah admin lain nanti dengan:
--   insert into public.admins (email) values ('email.lain@gmail.com');

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


-- ---------------------------------------------------------------------
-- BAGIAN 2 — Kritik & Saran
-- Pengunjung (anon) hanya boleh MENGIRIM. Membaca/mengubah/menghapus
-- hanya untuk admin.
-- ---------------------------------------------------------------------
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


-- ---------------------------------------------------------------------
-- BAGIAN 3 — Konten website yang bisa diedit admin
-- Satu baris per bagian: programs, faqs, struktur, cabinets.
-- Kalau baris belum ada, website memakai data bawaan di kode.
-- Semua orang boleh MEMBACA; hanya admin yang boleh MENULIS.
-- ---------------------------------------------------------------------
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

-- updated_at & updated_by diisi server, tidak bisa dipalsukan dari browser
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


-- ---------------------------------------------------------------------
-- BAGIAN 4 — Penyimpanan foto dokumentasi
-- Bucket publik (foto bisa dilihat siapa saja lewat URL-nya), tetapi
-- hanya admin yang boleh mengunggah / menghapus. Maks 5 MB per file,
-- hanya JPG / PNG / WebP.
-- ---------------------------------------------------------------------
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


-- ---------------------------------------------------------------------
-- Selesai. Cek: tabel admins harus berisi emailmu.
-- ---------------------------------------------------------------------
select email from public.admins;
