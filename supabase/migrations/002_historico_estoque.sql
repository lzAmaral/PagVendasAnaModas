-- ════════════════════════════════════════════════════════
-- ANA MODAS — Histórico de Estoque
-- Cole no SQL Editor do painel Supabase e execute
-- ════════════════════════════════════════════════════════

-- ── TABELA: historico_estoque ─────────────────────────
create table if not exists historico_estoque (
  id                uuid primary key default gen_random_uuid(),
  tamanho_id        uuid not null references tamanhos(id) on delete cascade,
  produto_nome      text not null,
  tamanho           text not null,
  estoque_anterior  int not null,
  estoque_novo      int not null,
  alterado_em       timestamptz not null default now()
);

-- ── ÍNDICES ───────────────────────────────────────────
create index if not exists idx_historico_tamanho on historico_estoque(tamanho_id);
create index if not exists idx_historico_data    on historico_estoque(alterado_em desc);

-- ── RLS ───────────────────────────────────────────────
alter table historico_estoque enable row level security;

create policy "Historico leitura autenticado"
  on historico_estoque for select using (auth.role() = 'authenticated');

create policy "Historico insercao service role"
  on historico_estoque for insert with check (true);
