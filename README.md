# 🛍️ Ana Modas — E-commerce de Uniformes Escolares

> Plataforma de e-commerce desenvolvida sob demanda para a **Ana Modas**, loja de uniformes escolares localizada em Cerquilho-SP.  
> O projeto permite que os clientes naveguem pelo catálogo, escolham tamanhos e quantidades, e finalizem pedidos de forma prática — com notificações em tempo real para a lojista via Telegram.

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel&logoColor=white)

---

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como uma solução completa de e-commerce para uma empresa real. A **Ana Modas** é uma loja física de uniformes escolares que precisava de presença digital para atender suas clientes de forma mais eficiente.

### Problema
A loja recebia pedidos manualmente via WhatsApp, sem controle de estoque, sem catálogo visual e sem organização dos pedidos — tudo dependia de anotações manuais.

### Solução
Uma plataforma web mobile-first onde as clientes podem:
- Navegar pelo catálogo completo com fotos reais dos produtos
- Filtrar por escola (SESI / Escola Municipal)
- Selecionar tamanhos e ver o preço atualizado automaticamente
- Montar o carrinho e finalizar o pedido com nome e telefone
- A lojista recebe notificação instantânea no Telegram com os detalhes completos do pedido

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Catálogo com filtros** | Produtos organizados por escola (SESI / Municipal) com filtros rápidos |
| **Agrupamento inteligente** | Uniformes do mesmo tipo são agrupados em um único card, com todos os tamanhos e preço dinâmico |
| **Carrinho persistente** | Carrinho salvo no localStorage — não perde ao fechar o navegador |
| **Checkout simplificado** | Formulário enxuto (nome + telefone) para finalização rápida |
| **Notificação via Telegram** | Bot automático envia resumo completo do pedido para a lojista em tempo real |
| **Painel administrativo** | Área protegida por autenticação para gerenciamento de pedidos e status |
| **Design responsivo** | Interface mobile-first otimizada para o público-alvo (mães comprando pelo celular) |

---

## 🛠️ Stack Técnica

| Camada | Tecnologia |
|---|---|
| **Framework** | Next.js 16 (App Router + Server Actions) |
| **Linguagem** | TypeScript |
| **Estilização** | Tailwind CSS 4 + CSS customizado |
| **Banco de Dados** | Supabase (PostgreSQL) |
| **Autenticação** | Supabase Auth |
| **Armazenamento de Imagens** | Supabase Storage |
| **Estado Global** | Zustand (carrinho com persistência em localStorage) |
| **Notificações** | Telegram Bot API |
| **Hospedagem** | Vercel |
| **Tipografia** | Google Fonts (Nunito + Nunito Sans) |
| **Ícones** | Lucide React |

---

## 🗺️ Estrutura de Páginas

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Catálogo público com filtros por escola | Público |
| `/carrinho` | Revisão dos itens do carrinho | Público |
| `/checkout` | Formulário de finalização do pedido | Público |
| `/pedido-confirmado` | Confirmação com número do pedido | Público |
| `/admin/login` | Login da administradora | Restrito |
| `/admin/pedidos` | Painel de gerenciamento de pedidos | Autenticado |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuito)
- Conta no [Telegram](https://telegram.org) (para notificações)

### 1. Clone o repositório

```bash
git clone https://github.com/lzAmaral/PagVendasAnaModas.git
cd PagVendasAnaModas/ana-modas
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o arquivo `supabase/migrations/001_init.sql` no **SQL Editor**
3. Em **Authentication > Users**, crie o usuário administrador (e-mail + senha)

### 4. Configure as variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# Telegram (notificações de pedidos)
TELEGRAM_BOT_TOKEN=seu-bot-token
TELEGRAM_CHAT_ID=seu-chat-id
```

> As chaves do Supabase ficam em **Settings → API** no painel do projeto.  
> Para o Telegram, crie um bot com o [@BotFather](https://t.me/BotFather) e obtenha seu ID com o [@userinfobot](https://t.me/userinfobot).

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy (Vercel)

1. Faça push do código para o GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Adicione as variáveis de ambiente no painel **Settings → Environment Variables**
4. O deploy é automático a cada push na branch `main`

---

## 📁 Estrutura do Projeto

```
ana-modas/
├── app/
│   ├── layout.tsx              # Layout global (fontes, header, footer)
│   ├── page.tsx                # Catálogo principal com agrupamento
│   ├── globals.css             # Design system e estilos globais
│   ├── carrinho/page.tsx       # Página do carrinho
│   ├── checkout/
│   │   ├── page.tsx            # Formulário de checkout
│   │   └── actions.ts          # Server Action (criar pedido + notificar)
│   ├── pedido-confirmado/      # Tela de confirmação
│   └── admin/
│       ├── login/page.tsx      # Login administrativo
│       └── pedidos/page.tsx    # Painel de pedidos
├── components/
│   ├── Header.tsx              # Header com navegação e carrinho
│   ├── ProdutoCard.tsx         # Card de produto com preço dinâmico
│   ├── SeletorTamanho.tsx      # Seletor de tamanhos
│   └── ContadorQuantidade.tsx  # Contador +/- de quantidade
├── lib/
│   ├── types.ts                # Tipagens TypeScript
│   └── supabase/               # Clientes Supabase (server/client)
├── store/
│   └── carrinho.ts             # Estado global do carrinho (Zustand)
└── public/
    ├── logo.png                # Logo da loja
    └── produtos/               # Fotos dos produtos
```

---

## 👨‍💻 Autor

**Luiz Amaral**  
Desenvolvedor Full Stack

- GitHub: [@lzAmaral](https://github.com/lzAmaral)

---

## 📄 Licença

Este projeto foi desenvolvido sob demanda para a **Ana Modas** (Cerquilho-SP).  
Código disponível para fins de portfólio e referência.
