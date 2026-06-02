'use client'

import { useState, useTransition } from 'react'
import { atualizarEstoque } from '@/app/admin/estoque/actions'

interface Tamanho {
  id: string
  tamanho: string
  estoque: number
}

interface ProdutoComTamanhos {
  id: string
  nome: string
  tamanhos: Tamanho[]
}

export function TabelaEstoque({ produtos }: { produtos: ProdutoComTamanhos[] }) {
  const [isPending, startTransition] = useTransition()
  const [savingId, setSavingId] = useState<string | null>(null)

  const handleEstoqueChange = (tamanhoId: string, novoValor: string) => {
    const valorNum = parseInt(novoValor, 10)
    if (isNaN(valorNum) || valorNum < 0) return

    setSavingId(tamanhoId)
    startTransition(async () => {
      try {
        await atualizarEstoque(tamanhoId, valorNum)
      } catch (error) {
        alert('Erro ao atualizar o estoque.')
      } finally {
        setSavingId(null)
      }
    })
  }

  return (
    <div className="admin-tabela-wrapper">
      <table className="admin-tabela">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Tamanho</th>
            <th>Estoque Disponível</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td style={{ fontWeight: 600 }}>{produto.nome}</td>
              <td colSpan={2} style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {produto.tamanhos.map((tam) => (
                      <tr key={tam.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                        <td style={{ width: '50%', padding: '0.75rem 1rem' }}>{tam.tamanho}</td>
                        <td style={{ width: '50%', padding: '0.75rem 1rem' }}>
                          <input
                            type="number"
                            min="0"
                            defaultValue={tam.estoque}
                            disabled={isPending && savingId === tam.id}
                            onBlur={(e) => {
                              if (e.target.value !== String(tam.estoque)) {
                                handleEstoqueChange(tam.id, e.target.value)
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur()
                              }
                            }}
                            className="admin-input"
                            style={{ width: '80px', padding: '0.4rem', borderRadius: '6px', border: '1px solid #ccc' }}
                          />
                          {isPending && savingId === tam.id && <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: 'var(--cinza)' }}>Salvando...</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
