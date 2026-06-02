import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard — Admin · Ana Modas' }

export const revalidate = 0

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Buscar todos os pedidos (ignorando cancelados para faturamento real, ou incluir todos)
  const { data: pedidos } = await supabase
    .from('pedidos')
    .select('total, status')

  const { data: itens } = await supabase
    .from('itens_pedido')
    .select('quantidade, produto:produtos(nome)')

  const pedidosValidos = (pedidos ?? []).filter((p) => p.status !== 'cancelado')
  const faturamentoTotal = pedidosValidos.reduce((acc, p) => acc + Number(p.total), 0)
  const totalPedidos = pedidosValidos.length

  // Agrupar itens para achar o mais vendido
  const contagemProdutos: Record<string, number> = {}
  let maisVendido = { nome: 'Nenhum', quantidade: 0 }

  if (itens) {
    itens.forEach((item) => {
      // @ts-ignore
      const nome = item.produto?.nome ?? 'Desconhecido'
      contagemProdutos[nome] = (contagemProdutos[nome] || 0) + item.quantidade
    })

    for (const [nome, quantidade] of Object.entries(contagemProdutos)) {
      if (quantidade > maisVendido.quantidade) {
        maisVendido = { nome, quantidade }
      }
    }
  }

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-titulo" style={{ margin: 0 }}>Dashboard</h1>
        <p style={{ color: 'var(--cinza)', marginTop: '0.5rem' }}>Visão geral das vendas</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="card-dashboard" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--cinza)', marginBottom: '0.5rem' }}>Total de Pedidos Válidos</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{totalPedidos}</p>
        </div>

        <div className="card-dashboard" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--cinza)', marginBottom: '0.5rem' }}>Faturamento Total</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--terracota)' }}>
            R$ {faturamentoTotal.toFixed(2).replace('.', ',')}
          </p>
        </div>

        <div className="card-dashboard" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--cinza)', marginBottom: '0.5rem' }}>Produto Mais Vendido</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>{maisVendido.nome}</p>
          <span style={{ fontSize: '0.85rem', color: 'var(--cinza)' }}>{maisVendido.quantidade} unidades vendidas</span>
        </div>
      </div>
    </>
  )
}
