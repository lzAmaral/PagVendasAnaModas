'use client'

import { useState, useTransition, useOptimistic } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/StatusBadge'
import type { Pedido, StatusPedido } from '@/lib/types'
import { ChevronDown, ChevronUp } from 'lucide-react'

const STATUS_OPCOES: StatusPedido[] = ['pendente', 'confirmado', 'pronto', 'entregue', 'cancelado']

interface TabelaPedidosProps {
  pedidosIniciais: Pedido[]
}

export function TabelaPedidos({ pedidosIniciais }: TabelaPedidosProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciais)
  const [expandido, setExpandido] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function toggleExpandido(id: string) {
    setExpandido((prev) => (prev === id ? null : id))
  }

  function handleStatusChange(pedidoId: string, novoStatus: StatusPedido) {
    const supabase = createClient()
    startTransition(async () => {
      const { error } = await supabase
        .from('pedidos')
        .update({ status: novoStatus })
        .eq('id', pedidoId)

      if (!error) {
        setPedidos((prev) =>
          prev.map((p) => (p.id === pedidoId ? { ...p, status: novoStatus } : p))
        )
      }
    })
  }

  if (pedidos.length === 0) {
    return <div className="estado-vazio"><p>Nenhum pedido registrado ainda.</p></div>
  }

  return (
    <div className="admin-tabela-wrapper">
      <table className="admin-tabela">
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Telefone</th>
            <th>Total</th>
            <th>Data</th>
            <th>Status</th>
            <th>Itens</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <>
              <tr key={pedido.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {pedido.id.slice(0, 8).toUpperCase()}
                </td>
                <td style={{ fontWeight: 600 }}>{pedido.nome_cliente}</td>
                <td>{pedido.telefone}</td>
                <td style={{ fontWeight: 700, color: 'var(--terracota)' }}>
                  R$ {Number(pedido.total).toFixed(2).replace('.', ',')}
                </td>
                <td>
                  {new Date(pedido.criado_em).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <td>
                  <select
                    className="admin-select"
                    value={pedido.status}
                    onChange={(e) => handleStatusChange(pedido.id, e.target.value as StatusPedido)}
                    disabled={isPending}
                    aria-label={`Status do pedido ${pedido.id.slice(0, 8)}`}
                  >
                    {STATUS_OPCOES.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => toggleExpandido(pedido.id)}
                    aria-label="Ver itens do pedido"
                    style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--cinza)' }}
                  >
                    {expandido === pedido.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {pedido.itens.length}
                  </button>
                </td>
              </tr>
              {expandido === pedido.id && (
                <tr key={`${pedido.id}-itens`}>
                  <td colSpan={7} style={{ background: '#faf7f2', padding: '0.75rem 1rem' }}>
                    <ul className="itens-lista">
                      {pedido.itens.map((item) => (
                        <li key={item.id}>
                          • {item.produto?.nome ?? item.produto_id} — Tam. {item.tamanho} × {item.quantidade} —{' '}
                          R$ {Number(item.preco_unitario).toFixed(2).replace('.', ',')} cada
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
