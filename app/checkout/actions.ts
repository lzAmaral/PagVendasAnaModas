'use server'

import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'

interface ItemInput {
  produto_id: string
  tamanho: string
  quantidade: number
  preco_unitario: number
}

interface PedidoInput {
  nome_cliente: string
  telefone: string
  itens: ItemInput[]
}

export async function criarPedido(input: PedidoInput) {
  const supabase = await createServiceClient()

  const total = input.itens.reduce(
    (acc, i) => acc + i.preco_unitario * i.quantidade,
    0
  )

  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .insert({
      nome_cliente: input.nome_cliente,
      telefone: input.telefone,
      total,
      status: 'pendente',
    })
    .select()
    .single()

  if (pedidoError || !pedido) {
    throw new Error('Erro ao criar pedido: ' + pedidoError?.message)
  }

  const itensPedido = input.itens.map((item) => ({
    pedido_id: pedido.id,
    produto_id: item.produto_id,
    tamanho: item.tamanho,
    quantidade: item.quantidade,
    preco_unitario: item.preco_unitario,
  }))

  const { error: itensError } = await supabase
    .from('itens_pedido')
    .insert(itensPedido)

  if (itensError) {
    throw new Error('Erro ao salvar itens: ' + itensError.message)
  }

  redirect(`/pedido-confirmado?id=${pedido.id}`)
}
