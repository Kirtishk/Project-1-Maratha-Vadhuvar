-- Supabase SQL schema for Firestore `users` migration
-- Field names intentionally match current frontend usage.

create table if not exists public.users (
  id text primary key,
  uid text unique,
  name text not null,
  email text unique,
  password text,
  mobile text,
  gender text,
  dob date,
  tob text,
  age integer,
  address text,
  district text,
  taluka text,
  village text,
  "nativePlace" text,
  jaat text,
  "bloodGroup" text,
  color text,
  education text,
  profession text,
  "fatherName" text,
  "motherName" text,
  "fatherProfession" text,
  "parentsAddress" text,
  "workAddress" text,
  "ancestralSurname" text,
  "annualIncome" numeric,
  "monthlyIncome" numeric,
  "heightFeet" numeric,
  "heightInch" numeric,
  brothers integer,
  sisters integer,
  hobbies jsonb default '[]'::jsonb,
  photos jsonb default '[]'::jsonb,
  "profileImage" text,
  "specialNotes" text,
  "dayOfWeek" text,
  gotra text,
  astrology jsonb default '{}'::jsonb,
  payment jsonb default '{}'::jsonb,
  "isNew" boolean default false,
  "isPaid" boolean default false,
  "isRejected" boolean default false,
  "createdAt" timestamptz,
  "submittedAt" timestamptz,
  "insertedAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

alter table public.users enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'Allow authenticated read users'
  ) then
    create policy "Allow authenticated read users"
      on public.users for select
      to authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'Allow authenticated update users'
  ) then
    create policy "Allow authenticated update users"
      on public.users for update
      to authenticated
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'Allow authenticated insert users'
  ) then
    create policy "Allow authenticated insert users"
      on public.users for insert
      to authenticated
      with check (true);
  end if;
end $$;

alter table public.users add column if not exists password text;
alter table public.users add column if not exists reset_token text;
alter table public.users add column if not exists reset_token_expires_at timestamptz;

-- Signup/login compatibility policies
-- These allow client-side signup flow to read/insert basic user rows.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'Public can read users for signup checks'
  ) then
    create policy "Public can read users for signup checks"
      on public.users for select
      to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'Public can insert users during signup'
  ) then
    create policy "Public can insert users during signup"
      on public.users for insert
      to anon, authenticated
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'Authenticated can update users'
  ) then
    create policy "Authenticated can update users"
      on public.users for update
      to authenticated
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'Public can update users in app mode'
  ) then
    create policy "Public can update users in app mode"
      on public.users for update
      to anon, authenticated
      using (true)
      with check (true);
  end if;
end $$;
