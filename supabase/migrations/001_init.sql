-- ════════════════════════════════════════════════════════
-- ANA MODAS — Script SQL para Supabase
-- Cole no SQL Editor do painel Supabase e execute
-- ════════════════════════════════════════════════════════

-- Extensão UUID
create extension if not exists "pgcrypto";

-- ── TABELA: produtos ──────────────────────────────────
create table if not exists produtos (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  preco       numeric(10,2) not null,
  foto_url    text,
  categoria   text not null check (categoria in ('sesi', 'municipal')),
  ativo       boolean not null default true,
  criado_em   timestamptz not null default now()
);

-- ── TABELA: tamanhos ──────────────────────────────────
create table if not exists tamanhos (
  id          uuid primary key default gen_random_uuid(),
  produto_id  uuid not null references produtos(id) on delete cascade,
  tamanho     text not null,
  estoque     int not null default 0 check (estoque >= 0)
);

-- ── TABELA: pedidos ───────────────────────────────────
create table if not exists pedidos (
  id              uuid primary key default gen_random_uuid(),
  nome_cliente    text not null,
  telefone        text not null,
  total           numeric(10,2) not null,
  status          text not null default 'pendente'
                  check (status in ('pendente','confirmado','pronto','entregue','cancelado')),
  observacao      text,
  criado_em       timestamptz not null default now()
);

-- ── TABELA: itens_pedido ──────────────────────────────
create table if not exists itens_pedido (
  id              uuid primary key default gen_random_uuid(),
  pedido_id       uuid not null references pedidos(id) on delete cascade,
  produto_id      uuid not null references produtos(id),
  tamanho         text not null,
  quantidade      int not null check (quantidade > 0),
  preco_unitario  numeric(10,2) not null
);

-- ── ÍNDICES ───────────────────────────────────────────
create index if not exists idx_produtos_ativo    on produtos(ativo);
create index if not exists idx_produtos_cat      on produtos(categoria);
create index if not exists idx_tamanhos_produto  on tamanhos(produto_id);
create index if not exists idx_pedidos_status    on pedidos(status);
create index if not exists idx_itens_pedido      on itens_pedido(pedido_id);

-- ── RLS ───────────────────────────────────────────────
alter table produtos     enable row level security;
alter table tamanhos     enable row level security;
alter table pedidos      enable row level security;
alter table itens_pedido enable row level security;

-- Produtos: leitura pública
create policy "Produtos leitura publica"
  on produtos for select using (true);

-- Tamanhos: leitura pública
create policy "Tamanhos leitura publica"
  on tamanhos for select using (true);

-- Pedidos: qualquer um insere; autenticado lê e atualiza
create policy "Pedidos insercao publica"
  on pedidos for insert with check (true);

create policy "Pedidos leitura autenticado"
  on pedidos for select using (auth.role() = 'authenticated');

create policy "Pedidos atualizacao autenticado"
  on pedidos for update using (auth.role() = 'authenticated');

-- Itens pedido: qualquer um insere; autenticado lê
create policy "Itens insercao publica"
  on itens_pedido for insert with check (true);

create policy "Itens leitura autenticado"
  on itens_pedido for select using (auth.role() = 'authenticated');

-- ── DADOS DE EXEMPLO ──────────────────────────────────
insert into produtos (nome, preco, categoria) values
  ('Camiseta Polo Adulto',   49.90, 'adulto'),
  ('Calça Social Adulto',    89.90, 'adulto'),
  ('Camiseta Polo Infantil', 39.90, 'infantil'),
  ('Shorts Infantil',        29.90, 'infantil')
on conflict do nothing;

-- Tamanhos adulto
insert into tamanhos (produto_id, tamanho, estoque)
select id, tam, est
from produtos,
  (values ('P',10),('M',15),('G',12),('GG',8)) as t(tam, est)
where categoria = 'adulto'
on conflict do nothing;

-- Tamanhos infantil
insert into tamanhos (produto_id, tamanho, estoque)
select id, tam, est
from produtos,
  (values ('4',10),('6',12),('8',10),('10',8),('12',6)) as t(tam, est)
where categoria = 'infantil'
on conflict do nothing;
