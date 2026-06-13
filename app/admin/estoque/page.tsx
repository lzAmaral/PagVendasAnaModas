import { createClient } from '@/lib/supabase/server'
import { TabelaEstoque } from '@/components/TabelaEstoque'
import { HistoricoEstoque } from '@/components/HistoricoEstoque'
import { AbasEstoque } from '@/components/AbasEstoque'
import { buscarHistorico } from './actions'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Estoque — Admin · Ana Modas' }

export const revalidate = 0

export default async function AdminEstoquePage() {
  const supabase = await createClient()

  const { data: produtos } = await supabase
    .from('produtos')
    .select('id, nome, tamanhos(id, tamanho, estoque)')
    .order('nome', { ascending: true })

  const produtosFormatados = (produtos ?? []).map((p) => ({
    id: p.id,
    nome: p.nome,
    // @ts-ignore
    tamanhos: (p.tamanhos ?? []).sort((a: any, b: any) => a.tamanho.localeCompare(b.tamanho))
  }))

  const historico = await buscarHistorico(100)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-titulo" style={{ margin: 0 }}>Estoque</h1>
          <p style={{ color: 'var(--cinza)', marginTop: '0.5rem' }}>
            Atualize as quantidades e clique em &quot;Salvar Tudo&quot; para confirmar.
          </p>
        </div>
      </div>

      <AbasEstoque>
        <TabelaEstoque produtos={produtosFormatados} />
        <HistoricoEstoque registros={historico} />
      </AbasEstoque>
    </>
  )
}
