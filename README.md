# Ana Modas — Loja de Uniformes Online

Loja de uniformes mobile-first integrada com WhatsApp. Clientes navegam pelo catálogo, escolhem tamanho e quantidade, informam nome e telefone e confirmam o pedido. A dona gerencia tudo pelo painel admin.

## Stack

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Backend/Banco:** Supabase (Postgres + Auth + Storage)
- **Estado:** Zustand (carrinho persistido em localStorage)
- **Hospedagem:** Vercel (gratuito)

## Configuração

### 1. Banco de dados (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o arquivo `supabase/migrations/001_init.sql`
3. Em **Authentication > Users**, crie o usuário (e-mail + senha) da dona da loja

### 2. Variáveis de ambiente

Edite o arquivo `.env.local` com as credenciais do seu projeto Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

> As chaves ficam em **Settings → API** no painel do Supabase.

### 3. Rodar localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## Páginas

| URL | Descrição |
|-----|-----------|
| `/` | Catálogo público com filtros Adulto/Infantil |
| `/carrinho` | Revisão do carrinho |
| `/checkout` | Formulário nome + telefone |
| `/pedido-confirmado` | Tela de sucesso |
| `/admin/login` | Login da dona da loja |
| `/admin/pedidos` | Painel de gerenciamento de pedidos |

## Deploy no Vercel

1. Faça push para um repositório GitHub
2. Importe o projeto no [vercel.com](https://vercel.com)
3. Adicione as variáveis de ambiente no painel do Vercel
4. Deploy automático a cada push!
# PagVendasAnaModas
