-- AI Tool Directory Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tools table
create table tools (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  short_description text not null,
  full_description text not null,
  url text not null,
  icon text,
  category text not null,
  tags text[] default '{}',
  pricing text not null,
  views integer default 0,
  trending boolean default false,
  featured boolean default false,
  verified boolean default false,
  rating numeric(3,2) default 0,
  review_count integer default 0,
  platform text[] default '{}',
  date_added timestamp with time zone default now(),
  last_updated timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Create users table (extends Supabase auth.users)
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create reviews table
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  tool_id uuid references tools(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  helpful_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create favorites table
create table favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tool_id uuid references tools(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user_id, tool_id)
);

-- Create tool submissions table
create table tool_submissions (
  id uuid primary key default uuid_generate_v4(),
  tool_name text not null,
  tool_url text not null,
  description text not null,
  category text not null,
  pricing text not null,
  submitter_name text,
  submitter_email text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone
);

-- Enable Row Level Security
alter table tools enable row level security;
alter table user_profiles enable row level security;
alter table reviews enable row level security;
alter table favorites enable row level security;
alter table tool_submissions enable row level security;

-- RLS Policies for tools (public read, admin write)
create policy "Tools are viewable by everyone"
  on tools for select
  using (true);

create policy "Authenticated users can insert tools"
  on tools for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update tools"
  on tools for update
  using (auth.role() = 'authenticated');

-- RLS Policies for user_profiles
create policy "Profiles are viewable by everyone"
  on user_profiles for select
  using (true);

create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

-- RLS Policies for reviews
create policy "Reviews are viewable by everyone"
  on reviews for select
  using (true);

create policy "Users can create reviews"
  on reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete own reviews"
  on reviews for delete
  using (auth.uid() = user_id);

-- RLS Policies for favorites
create policy "Users can view own favorites"
  on favorites for select
  using (auth.uid() = user_id);

create policy "Users can create own favorites"
  on favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on favorites for delete
  using (auth.uid() = user_id);

-- RLS Policies for tool_submissions
create policy "Submissions viewable by everyone"
  on tool_submissions for select
  using (true);

create policy "Anyone can submit tools"
  on tool_submissions for insert
  with check (true);

-- Create indexes for better performance
create index tools_category_idx on tools(category);
create index tools_trending_idx on tools(trending);
create index tools_featured_idx on tools(featured);
create index tools_date_added_idx on tools(date_added desc);
create index reviews_tool_id_idx on reviews(tool_id);
create index reviews_user_id_idx on reviews(user_id);
create index favorites_user_id_idx on favorites(user_id);
create index favorites_tool_id_idx on favorites(tool_id);

-- Create function to update tool rating
create or replace function update_tool_rating()
returns trigger as $$
begin
  update tools
  set 
    rating = (select avg(rating) from reviews where tool_id = new.tool_id),
    review_count = (select count(*) from reviews where tool_id = new.tool_id)
  where id = new.tool_id;
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update tool ratings
create trigger update_tool_rating_trigger
after insert or update or delete on reviews
for each row
execute function update_tool_rating();

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_tools_updated_at before update on tools
  for each row execute function update_updated_at_column();

create trigger update_user_profiles_updated_at before update on user_profiles
  for each row execute function update_updated_at_column();

create trigger update_reviews_updated_at before update on reviews
  for each row execute function update_updated_at_column();

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

-- RLS Policies for contact_messages
create policy "Anyone can insert contact messages"
  on contact_messages for insert
  with check (true);

create policy "Admins can view contact messages"
  on contact_messages for select
  using (auth.role() = 'authenticated');
