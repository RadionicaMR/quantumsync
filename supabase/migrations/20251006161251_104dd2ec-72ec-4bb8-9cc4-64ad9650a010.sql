begin;

-- Ensure RLS is enabled
alter table public.patients enable row level security;
alter table public.sessions enable row level security;

-- Helper to get current user's email from JWT
create or replace function public.auth_email()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'email'), '')
$$;

-- Drop permissive/old policies
drop policy if exists "Therapists can create patients" on public.patients;
drop policy if exists "Therapists can view own patients" on public.patients;
drop policy if exists "Therapists can update own patients" on public.patients;
drop policy if exists "Therapists can delete own patients" on public.patients;

drop policy if exists "Therapists can create sessions" on public.sessions;
drop policy if exists "Therapists can view own sessions" on public.sessions;
drop policy if exists "Therapists can update own sessions" on public.sessions;
drop policy if exists "Therapists can delete own sessions" on public.sessions;

-- Restrictive policies using therapist email
create policy "Therapists can create patients"
on public.patients
for insert
to authenticated
with check (therapist_id = public.auth_email());

create policy "Therapists can view own patients"
on public.patients
for select
to authenticated
using (therapist_id = public.auth_email());

create policy "Therapists can update own patients"
on public.patients
for update
to authenticated
using (therapist_id = public.auth_email());

create policy "Therapists can delete own patients"
on public.patients
for delete
to authenticated
using (therapist_id = public.auth_email());

create policy "Therapists can create sessions"
on public.sessions
for insert
to authenticated
with check (therapist_id = public.auth_email());

create policy "Therapists can view own sessions"
on public.sessions
for select
to authenticated
using (therapist_id = public.auth_email());

create policy "Therapists can update own sessions"
on public.sessions
for update
to authenticated
using (therapist_id = public.auth_email());

create policy "Therapists can delete own sessions"
on public.sessions
for delete
to authenticated
using (therapist_id = public.auth_email());

-- Recreate FK for sessions.patient_id so relations work in selects
alter table public.sessions drop constraint if exists sessions_patient_id_fkey;
alter table public.sessions
add constraint sessions_patient_id_fkey
foreign key (patient_id) references public.patients(id) on delete cascade;

commit;