import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ItemCarrinho, Produto } from '@/lib/types'

interface CarrinhoStore {
  itens: ItemCarrinho[]
  adicionarItem: (produto: Produto, tamanho: string, quantidade: number) => void
  removerItem: (produtoId: string, tamanho: string) => void
  atualizarQuantidade: (produtoId: string, tamanho: string, quantidade: number) => void
  limparCarrinho: () => void
  total: () => number
  totalItens: () => number
}

export const useCarrinho = create<CarrinhoStore>()(
  persist(
    (set, get) => ({
      itens: [],

      adicionarItem: (produto, tamanho, quantidade) => {
        set((state) => {
          const existente = state.itens.find(
            (i) => i.produto.id === produto.id && i.tamanho === tamanho
          )
          if (existente) {
            return {
              itens: state.itens.map((i) =>
                i.produto.id === produto.id && i.tamanho === tamanho
                  ? { ...i, quantidade: i.quantidade + quantidade }
                  : i
              ),
            }
          }
          return { itens: [...state.itens, { produto, tamanho, quantidade }] }
        })
      },

      removerItem: (produtoId, tamanho) => {
        set((state) => ({
          itens: state.itens.filter(
            (i) => !(i.produto.id === produtoId && i.tamanho === tamanho)
          ),
        }))
      },

      atualizarQuantidade: (produtoId, tamanho, quantidade) => {
        if (quantidade <= 0) {
          get().removerItem(produtoId, tamanho)
          return
        }
        set((state) => ({
          itens: state.itens.map((i) =>
            i.produto.id === produtoId && i.tamanho === tamanho
              ? { ...i, quantidade }
              : i
          ),
        }))
      },

      limparCarrinho: () => set({ itens: [] }),

      total: () =>
        get().itens.reduce(
          (acc, item) => acc + item.produto.preco * item.quantidade,
          0
        ),

      totalItens: () =>
        get().itens.reduce((acc, item) => acc + item.quantidade, 0),
    }),
    {
      name: 'ana-modas-carrinho',
    }
  )
)
