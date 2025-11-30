-- Create contact_messages table
create table contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'unread' check (status in ('unread', 'read', 'replied')),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table contact_messages enable row level security;

-- RLS Policies
create policy "Anyone can insert contact messages"
  on contact_messages for insert
  with check (true);

create policy "Admins can view contact messages"
  on contact_messages for select
  using (auth.role() = 'authenticated'); -- Ideally check for admin role if you have one, for now authenticated users (admins)
