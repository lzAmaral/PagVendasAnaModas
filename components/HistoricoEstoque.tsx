'use client'

import { ArrowDown, ArrowUp, Minus } from 'lucide-react'

interface RegistroHistorico {
  id: string
  tamanho_id: string
  produto_nome: string
  tamanho: string
  estoque_anterior: number
  estoque_novo: number
  alterado_em: string
}

export function HistoricoEstoque({ registros }: { registros: RegistroHistorico[] }) {
  if (registros.length === 0) {
    return (
      <div className="estado-vazio" style={{ padding: '3rem' }}>
        <p>Nenhuma alteração registrada ainda.</p>
        <p style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>
          O histórico será preenchido quando você salvar alterações no estoque.
        </p>
      </div>
    )
  }

  const formatarData = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDiferenca = (anterior: number, novo: number) => {
    const diff = novo - anterior
    if (diff > 0) return { tipo: 'aumento' as const, valor: `+${diff}` }
    if (diff < 0) return { tipo: 'diminuicao' as const, valor: `${diff}` }
    return { tipo: 'igual' as const, valor: '0' }
  }

  return (
    <div className="admin-tabela-wrapper">
      <table className="admin-tabela">
        <thead>
          <tr>
            <th>Data / Hora</th>
            <th>Produto</th>
            <th>Tamanho</th>
            <th>Anterior</th>
            <th>Novo</th>
            <th>Variação</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((reg) => {
            const diff = getDiferenca(reg.estoque_anterior, reg.estoque_novo)
            return (
              <tr key={reg.id}>
                <td style={{ whiteSpace: 'nowrap', color: 'var(--cinza)', fontSize: '0.8rem' }}>
                  {formatarData(reg.alterado_em)}
                </td>
                <td style={{ fontWeight: 600 }}>{reg.produto_nome}</td>
                <td>{reg.tamanho}</td>
                <td style={{ textAlign: 'center', fontWeight: 500 }}>{reg.estoque_anterior}</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{reg.estoque_novo}</td>
                <td>
                  <span className={`badge-variacao badge-variacao--${diff.tipo}`}>
                    {diff.tipo === 'aumento' && <ArrowUp size={12} />}
                    {diff.tipo === 'diminuicao' && <ArrowDown size={12} />}
                    {diff.tipo === 'igual' && <Minus size={12} />}
                    {diff.valor}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
