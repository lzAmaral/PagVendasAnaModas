#  Ana Modas — E-commerce de Uniformes Escolares

> Plataforma de e-commerce desenvolvida sob demanda para a **Ana Modas**, loja de uniformes escolares localizada em Cerquilho-SP.  
> O projeto permite que os clientes naveguem pelo catálogo, escolham tamanhos e quantidades, e finalizem pedidos de forma prática — com notificações em tempo real para a lojista via Telegram.

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel&logoColor=white)

---

## Sobre o Projeto

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

## Funcionalidades

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

## Stack Técnica

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

## Estrutura de Páginas

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Catálogo público com filtros por escola | Público |
| `/carrinho` | Revisão dos itens do carrinho | Público |
| `/checkout` | Formulário de finalização do pedido | Público |
| `/pedido-confirmado` | Confirmação com número do pedido | Público |
| `/admin/login` | Login da administradora | Restrito |
| `/admin/pedidos` | Painel de gerenciamento de pedidos | Autenticado |

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

##  Autor

**Luiz Amaral**  
Desenvolvedor Full Stack

- GitHub: [@lzAmaral](https://github.com/lzAmaral)

---

##  Licença

Este projeto foi desenvolvido sob demanda para a **Ana Modas** (Cerquilho-SP).  
Código disponível para fins de portfólio e referência.
