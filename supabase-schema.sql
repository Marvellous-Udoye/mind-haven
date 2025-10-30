-- Drop existing tables to start fresh
drop table if exists messages;
drop table if exists conversation_participants cascade;
drop table if exists conversations;
drop table if exists appointments;
drop table if exists profiles cascade;

-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  first_name text not null,
  last_name text not null,
  avatar_url text,
  role text not null check (role in ('care_seeker', 'care_provider')),
  phone text,
  dob date,
  gender text
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, role, avatar_url, phone, dob, gender)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.raw_user_meta_data->>'role', new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'phone', (new.raw_user_meta_data->>'dob')::date, new.raw_user_meta_data->>'gender');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a table for appointments
create table appointments (
  id uuid primary key default gen_random_uuid(),
  seeker_id uuid references public.profiles(id) on delete cascade not null,
  provider_id uuid references public.profiles(id) on delete cascade not null,
  doctor_name text not null,
  specialty text not null,
  module text not null,
  appointment_date date not null,
  appointment_time time not null,
  location_type text not null,
  location text not null,
  status text not null check (status in ('upcoming', 'completed', 'cancelled')) default 'upcoming',
  created_at timestamp with time zone default now()
);

-- Set up RLS for appointments
alter table appointments
  enable row level security;

create policy "Users can view their own appointments." on appointments
  for select using (auth.uid() = seeker_id or auth.uid() = provider_id);

create policy "Care seekers can create appointments." on appointments
  for insert with check (auth.uid() = seeker_id);

create policy "Users can update their own appointments." on appointments
  for update using (auth.uid() = seeker_id or auth.uid() = provider_id);

-- Create a table for conversations
create table conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now()
);

-- Create a linking table for conversation participants
create table conversation_participants (
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  primary key (conversation_id, user_id)
);

-- Create a table for messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  author text not null check (author in ('user', 'doctor')),
  text text not null,
  at timestamp with time zone default now()
);

-- Set up RLS for conversations and messages
alter table conversations enable row level security;
alter table conversation_participants enable row level security;
alter table messages enable row level security;

create policy "Users can view conversations they are a part of." on conversations
  for select using (id in (
    select conversation_id from conversation_participants where user_id = auth.uid()
  ));

create policy "Users can view participants of conversations they are in." on conversation_participants
  for select using (conversation_id in (
    select id from conversations
  ));

create policy "Users can send messages in conversations they are a part of." on messages
  for insert with check (
    sender_id = auth.uid() and
    conversation_id in (select conversation_id from conversation_participants where user_id = auth.uid())
  );

create policy "Users can view messages in conversations they are a part of." on messages
  for select using (
    conversation_id in (select conversation_id from conversation_participants where user_id = auth.uid())
  );
