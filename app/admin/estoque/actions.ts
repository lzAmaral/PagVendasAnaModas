'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
  revalidatePath('/checkout') // revalida checkout por via de dúvidas
}
