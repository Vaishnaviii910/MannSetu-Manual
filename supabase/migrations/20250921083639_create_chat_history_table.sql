create table public.chat_history (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    message text not null,
    sender text not null check (sender in ('user', 'bot')),
    created_at timestamp with time zone not null default now(),
    primary key (id)
);

-- Secure the table with Row Level Security (RLS)
alter table chat_history enable row level security;

-- A user can only see their own chat history
create policy "Users can view their own chat history."
on chat_history for select
using (auth.uid() = user_id);

-- A user can insert messages into their own chat history
create policy "Users can insert their own messages."
on chat_history for insert
with check (auth.uid() = user_id);