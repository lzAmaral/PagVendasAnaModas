import { createClient } from '@/lib/supabase/server'
import { TabelaPedidos } from '@/components/TabelaPedidos'
import type { Metadata } from 'next'
import type { Pedido } from '@/lib/types'

export const metadata: Metadata = { title: 'Pedidos — Admin · Ana Modas' }

export const revalidate = 0

export default async function AdminPedidosPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('pedidos')
    .select('*, itens:itens_pedido(*, produto:produtos(nome))')
    .order('criado_em', { ascending: false })

  const pedidos = (data ?? []) as Pedido[]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-titulo" style={{ margin: 0 }}>Pedidos</h1>
        <span style={{ fontSize: '0.82rem', color: 'var(--cinza)' }}>
          {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
        </span>
      </div>
      <TabelaPedidos pedidosIniciais={pedidos} />
    </>
  )
}
