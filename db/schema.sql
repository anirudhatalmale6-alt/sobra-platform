-- =====================================================================
--  SOBRA — Base de dados (Supabase / PostgreSQL)
--  Cole todo este conteúdo no Supabase: SQL Editor > New query > Run.
--  Cria as tabelas, categorias, segurança (RLS) e o armazenamento de fotos.
--  Pode correr várias vezes sem problema (é idempotente).
-- =====================================================================

-- ---------- PROFILES (contas de empresa) ----------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  company_name text not null default '',
  description  text,
  location     text,
  phone        text,
  website      text,
  logo_url     text,
  is_admin     boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ---------- CATEGORIES / SUBCATEGORIES ----------
create table if not exists public.categories (
  id    int primary key,
  slug  text unique not null,
  name  text not null,
  icon  text,
  sort  int not null default 0
);

create table if not exists public.subcategories (
  id          int primary key,
  category_id int not null references public.categories(id) on delete cascade,
  slug        text not null,
  name        text not null,
  unique (category_id, slug)
);

-- ---------- LISTINGS (anúncios) ----------
create table if not exists public.listings (
  id             uuid primary key default gen_random_uuid(),
  owner          uuid not null references auth.users(id) on delete cascade,
  title          text not null,
  description    text,
  price          numeric(10,2) not null default 0,
  original_price numeric(10,2),
  condition      text not null default 'Excedente',
  category_id    int references public.categories(id),
  subcategory_id int references public.subcategories(id),
  location       text,
  images         text[] not null default '{}',
  status         text not null default 'active',   -- active | expired | hidden
  created_at     timestamptz not null default now(),
  expires_at     timestamptz
);

create index if not exists listings_owner_idx    on public.listings(owner);
create index if not exists listings_category_idx on public.listings(category_id);
create index if not exists listings_status_idx   on public.listings(status);
create index if not exists listings_created_idx  on public.listings(created_at desc);

-- ---------- COLUNAS ADICIONAIS (migração, seguras de correr várias vezes) ----------
alter table public.profiles add column if not exists address       text;
alter table public.listings add column if not exists expiry_date   date;  -- validade próxima
alter table public.listings add column if not exists promo_ends_at date;  -- fim da promoção

-- ---------- AUTO-CREATE PROFILE ON SIGN-UP ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, company_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'company_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
--  ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles      enable row level security;
alter table public.categories    enable row level security;
alter table public.subcategories enable row level security;
alter table public.listings      enable row level security;

-- profiles: toda a gente vê (perfis de empresa são públicos); cada um gere o seu
drop policy if exists "profiles read"   on public.profiles;
drop policy if exists "profiles insert" on public.profiles;
drop policy if exists "profiles update" on public.profiles;
create policy "profiles read"   on public.profiles for select using (true);
create policy "profiles insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles update" on public.profiles for update using (auth.uid() = id);

-- categorias: leitura pública
drop policy if exists "categories read"    on public.categories;
drop policy if exists "subcategories read" on public.subcategories;
create policy "categories read"    on public.categories    for select using (true);
create policy "subcategories read" on public.subcategories for select using (true);

-- listings: público vê os ativos; o dono vê/gere os seus
drop policy if exists "listings public read" on public.listings;
drop policy if exists "listings owner read"  on public.listings;
drop policy if exists "listings insert"      on public.listings;
drop policy if exists "listings update"      on public.listings;
drop policy if exists "listings delete"      on public.listings;
create policy "listings public read" on public.listings for select using (status = 'active');
create policy "listings owner read"  on public.listings for select using (auth.uid() = owner);
create policy "listings insert"      on public.listings for insert with check (auth.uid() = owner);
create policy "listings update"      on public.listings for update using (auth.uid() = owner);
create policy "listings delete"      on public.listings for delete using (auth.uid() = owner);

-- =====================================================================
--  STORAGE (fotos dos anúncios) — bucket público "listings"
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('listings', 'listings', true)
on conflict (id) do nothing;

drop policy if exists "listings img read"   on storage.objects;
drop policy if exists "listings img insert" on storage.objects;
drop policy if exists "listings img update" on storage.objects;
drop policy if exists "listings img delete" on storage.objects;

-- leitura pública das imagens
create policy "listings img read" on storage.objects
  for select using (bucket_id = 'listings');

-- cada empresa só escreve na sua própria pasta (prefixo = user id)
create policy "listings img insert" on storage.objects
  for insert with check (
    bucket_id = 'listings' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "listings img update" on storage.objects
  for update using (
    bucket_id = 'listings' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "listings img delete" on storage.objects
  for delete using (
    bucket_id = 'listings' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- =====================================================================
--  SEED — CATEGORIAS E SUBCATEGORIAS
-- =====================================================================
insert into public.categories (id, slug, name, icon, sort) values
  (1,'alimentacao','Alimentação','🥫',1),
  (2,'moda','Moda','👗',2),
  (3,'casa','Casa','🛋️',3),
  (4,'construcao','Construção','🧱',4),
  (5,'informatica','Informática','💻',5),
  (6,'tecnologia','Tecnologia','📱',6),
  (7,'beleza','Beleza','💄',7),
  (8,'desporto','Desporto','⚽',8),
  (9,'automovel','Automóvel','🚗',9),
  (10,'escritorio','Escritório','🗂️',10)
on conflict (id) do update set name = excluded.name, icon = excluded.icon, slug = excluded.slug;

insert into public.subcategories (id, category_id, slug, name) values
  (101,1,'talho','Talho'),(102,1,'supermercado','Supermercado'),(103,1,'padaria','Padaria'),(104,1,'mercearia','Mercearia'),(105,1,'bebidas','Bebidas'),(106,1,'congelados','Congelados'),(107,1,'perto-validade','Perto da validade'),
  (201,2,'homem','Homem'),(202,2,'mulher','Mulher'),(203,2,'crianca','Criança'),(204,2,'calcado','Calçado'),(205,2,'acessorios','Acessórios'),
  (301,3,'mobiliario','Mobiliário'),(302,3,'decoracao','Decoração'),(303,3,'cozinha','Cozinha'),(304,3,'eletrodomesticos','Eletrodomésticos'),(305,3,'jardim','Jardim'),
  (401,4,'materiais','Materiais'),(402,4,'ferramentas','Ferramentas'),(403,4,'canalizacao','Canalização'),(404,4,'eletrico','Elétrico'),(405,4,'tintas','Tintas'),
  (501,5,'computadores','Computadores'),(502,5,'componentes','Componentes'),(503,5,'perifericos','Periféricos'),(504,5,'redes','Redes'),(505,5,'software','Software'),
  (601,6,'telemoveis','Telemóveis'),(602,6,'audio','Áudio'),(603,6,'tv-imagem','TV & Imagem'),(604,6,'gaming','Gaming'),(605,6,'wearables','Wearables'),
  (701,7,'cosmetica','Cosmética'),(702,7,'perfumes','Perfumes'),(703,7,'cabelo','Cabelo'),(704,7,'cuidado-corporal','Cuidado corporal'),
  (801,8,'fitness','Fitness'),(802,8,'futebol','Futebol'),(803,8,'outdoor','Outdoor'),(804,8,'ciclismo','Ciclismo'),(805,8,'roupa-desportiva','Roupa desportiva'),
  (901,9,'pecas','Peças'),(902,9,'acessorios-auto','Acessórios'),(903,9,'pneus','Pneus'),(904,9,'oleos','Óleos'),
  (1001,10,'papelaria','Papelaria'),(1002,10,'mobiliario-escritorio','Mobiliário de escritório'),(1003,10,'consumiveis','Consumíveis')
on conflict (id) do update set name = excluded.name, slug = excluded.slug, category_id = excluded.category_id;

-- Fim. A base de dados está pronta.
