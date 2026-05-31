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

  try {
    // Buscar nomes dos produtos para a notificação
    const produtoIds = input.itens.map(i => i.produto_id)
    const { data: produtos } = await supabase.from('produtos').select('id, nome').in('id', produtoIds)
    
    const itensText = input.itens.map(item => {
      const p = produtos?.find(p => p.id === item.produto_id)
      return `- ${item.quantidade}x ${p?.nome || 'Produto'} (Tam: ${item.tamanho})`
    }).join('\n')

    await notificarTelegram(pedido.id, input.nome_cliente, input.telefone, total, itensText)
  } catch (err) {
    console.error('Erro ao enviar notificação:', err)
  }

  redirect(`/pedido-confirmado?id=${pedido.id}`)
}

async function notificarTelegram(pedidoId: string, nome: string, telefone: string, total: number, itensText: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) return

  const mensagem = `
🛍️ *Novo Pedido Recebido!* 
*ID:* #${pedidoId.slice(0, 8).toUpperCase()}

👤 *Cliente:* ${nome}
📱 *WhatsApp:* ${telefone}

📦 *Itens:*
${itensText}

💰 *Total:* R$ ${total.toFixed(2).replace('.', ',')}
`

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: mensagem,
      parse_mode: 'Markdown'
    })
  })
}
