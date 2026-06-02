import { createClient } from '@/lib/supabase/server'
import { TabelaEstoque } from '@/components/TabelaEstoque'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Estoque — Admin · Ana Modas' }

export const revalidate = 0

export default async function AdminEstoquePage() {
  const supabase = await createClient()

  // Buscar produtos com seus tamanhos, ordenados alfabeticamente
  const { data: produtos } = await supabase
    .from('produtos')
    .select('id, nome, tamanhos(id, tamanho, estoque)')
    .order('nome', { ascending: true })

  // Garantir que a estrutura exista
  const produtosFormatados = (produtos ?? []).map((p) => ({
    id: p.id,
    nome: p.nome,
    // @ts-ignore
    tamanhos: (p.tamanhos ?? []).sort((a: any, b: any) => a.tamanho.localeCompare(b.tamanho))
  }))

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-titulo" style={{ margin: 0 }}>Estoque</h1>
          <p style={{ color: 'var(--cinza)', marginTop: '0.5rem' }}>Gerencie a quantidade disponível de cada tamanho.</p>
        </div>
      </div>
      <TabelaEstoque produtos={produtosFormatados} />
    </>
  )
}
