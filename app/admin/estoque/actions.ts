'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface AlteracaoEstoque {
  tamanhoId: string
  produtoNome: string
  tamanho: string
  estoqueAnterior: number
  estoqueNovo: number
}

export async function atualizarEstoque(tamanhoId: string, novoEstoque: number) {
  const supabase = await createServiceClient()

  if (novoEstoque < 0) {
    throw new Error('Estoque não pode ser negativo')
  }

  const { error } = await supabase
    .from('tamanhos')
    .update({ estoque: novoEstoque })
    .eq('id', tamanhoId)

  if (error) {
    console.error('Erro ao atualizar estoque:', error)
    throw new Error('Falha ao atualizar estoque')
  }

  revalidatePath('/admin/estoque')
  revalidatePath('/checkout')
}

export async function salvarEstoqueLote(alteracoes: AlteracaoEstoque[]) {
  const supabase = await createServiceClient()

  const mudancas = alteracoes.filter(a => a.estoqueAnterior !== a.estoqueNovo)

  if (mudancas.length === 0) {
    return { sucesso: true, totalAlterado: 0 }
  }

  for (const mudanca of mudancas) {
    if (mudanca.estoqueNovo < 0) {
      throw new Error(`Estoque não pode ser negativo para ${mudanca.produtoNome} - ${mudanca.tamanho}`)
    }
  }

  const erros: string[] = []

  for (const mudanca of mudancas) {
    const { error: updateError } = await supabase
      .from('tamanhos')
      .update({ estoque: mudanca.estoqueNovo })
      .eq('id', mudanca.tamanhoId)

    if (updateError) {
      erros.push(`${mudanca.produtoNome} (${mudanca.tamanho}): ${updateError.message}`)
      continue
    }

    const { error: logError } = await supabase
      .from('historico_estoque')
      .insert({
        tamanho_id: mudanca.tamanhoId,
        produto_nome: mudanca.produtoNome,
        tamanho: mudanca.tamanho,
        estoque_anterior: mudanca.estoqueAnterior,
        estoque_novo: mudanca.estoqueNovo,
      })

    if (logError) {
      console.error('Erro ao registrar histórico:', logError)
    }
  }

  revalidatePath('/admin/estoque')
  revalidatePath('/checkout')
  revalidatePath('/')

  if (erros.length > 0) {
    throw new Error(`Erros ao salvar: ${erros.join('; ')}`)
  }

  return { sucesso: true, totalAlterado: mudancas.length }
}

export async function buscarHistorico(limite: number = 50) {
  const supabase = await createServiceClient()

  const { data, error } = await supabase
    .from('historico_estoque')
    .select('*')
    .order('alterado_em', { ascending: false })
    .limit(limite)

  if (error) {
    console.error('Erro ao buscar histórico:', error)
    return []
  }

  return data ?? []
}
