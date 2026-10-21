-- Chart Dojo: Datenbank für Supabase (SQL Editor -> New query -> einfügen -> Run)
create table if not exists public.dojo_data (
  user_id    uuid not null references auth.users(id) on delete cascade,
  key        text not null,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.dojo_data enable row level security;

create policy "own rows select" on public.dojo_data for select using (auth.uid() = user_id);
create policy "own rows insert" on public.dojo_data for insert with check (auth.uid() = user_id);
create policy "own rows update" on public.dojo_data for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows delete" on public.dojo_data for delete using (auth.uid() = user_id);
