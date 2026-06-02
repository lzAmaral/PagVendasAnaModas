'use server'

import { createClient } from '@/lib/supabase/server'

export async function consultarEstoqueReal(tamanhoId: string): Promise<number> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('tamanhos')
    .select('estoque')
    .eq('id', tamanhoId)
    .single()

  if (error || !data) {
    return 0
  }

  return data.estoque
}
