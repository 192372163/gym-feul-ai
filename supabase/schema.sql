-- Run this in the Supabase SQL editor

create table if not exists profiles (
  id text primary key, -- Firebase UID
  email text,
  name text,
  age int,
  gender text,
  height numeric, -- cm
  weight numeric, -- kg
  goal text, -- e.g. 'lose_weight', 'gain_muscle', 'maintain'
  activity_level text, -- e.g. 'sedentary', 'light', 'moderate', 'active', 'very_active'
  dietary_preference text, -- e.g. 'vegetarian', 'vegan', 'non_veg', 'keto'
  injuries text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  user_id text references profiles(id) on delete cascade,
  workout_plan jsonb not null,
  diet_plan jsonb not null,
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_plans_user_id on plans(user_id);

create table if not exists workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text references profiles(id) on delete cascade,
  day text, -- e.g. 'Monday'
  exercise_name text,
  sets int,
  reps text,
  weight numeric,
  completed boolean default true,
  logged_at timestamptz default now()
);
create index if not exists idx_workout_logs_user_id on workout_logs(user_id);

create table if not exists meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text references profiles(id) on delete cascade,
  meal_name text,
  items jsonb,
  calories numeric,
  logged_at timestamptz default now()
);
create index if not exists idx_meal_logs_user_id on meal_logs(user_id);

create table if not exists water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text references profiles(id) on delete cascade,
  amount_ml int not null,
  logged_at timestamptz default now()
);
create index if not exists idx_water_logs_user_id on water_logs(user_id);

create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text references profiles(id) on delete cascade,
  weight numeric not null,
  logged_at timestamptz default now()
);
create index if not exists idx_weight_logs_user_id on weight_logs(user_id);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text references profiles(id) on delete cascade,
  plan_type text not null, -- e.g. 'monthly', 'yearly'
  status text not null default 'active', -- 'active', 'expired', 'cancelled'
  razorpay_order_id text,
  razorpay_payment_id text,
  starts_at timestamptz default now(),
  expires_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_subscriptions_user_id on subscriptions(user_id);
