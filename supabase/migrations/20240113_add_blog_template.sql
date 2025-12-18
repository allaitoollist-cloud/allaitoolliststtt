-- Add template field to blogs table
alter table blogs add column if not exists template text default 'default';

-- Add comment
comment on column blogs.template is 'Blog template type: default or modern';

