export type Categoria = 'adulto' | 'infantil'

export type StatusPedido =
  | 'pendente'
  | 'confirmado'
  | 'pronto'
  | 'entregue'
  | 'cancelado'

export interface Tamanho {
  id: string
  produto_id: string
  tamanho: string
  estoque: number
}

export interface Produto {
  id: string
  nome: string
  preco: number
  foto_url: string | null
  categoria: Categoria
  ativo: boolean
  criado_em: string
  tamanhos: Tamanho[]
}

export interface ItemCarrinho {
  produto: Produto
  tamanho: string
  quantidade: number
}

export interface ItemPedido {
  id: string
  pedido_id: string
  produto_id: string
  tamanho: string
  quantidade: number
  preco_unitario: number
  produto?: Produto
}

export interface Pedido {
  id: string
  nome_cliente: string
  telefone: string
  total: number
  status: StatusPedido
  observacao: string | null
  criado_em: string
  itens: ItemPedido[]
}
