'use client'

import { useState, useTransition, useCallback } from 'react'
import { salvarEstoqueLote } from '@/app/admin/estoque/actions'
import { Save, Check, Loader2, RotateCcw } from 'lucide-react'

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

interface ValoresEditados {
  [tamanhoId: string]: {
    valor: number
    original: number
    produtoNome: string
    tamanho: string
  }
}

export function TabelaEstoque({ produtos }: { produtos: ProdutoComTamanhos[] }) {
  const [isPending, startTransition] = useTransition()
  const [editados, setEditados] = useState<ValoresEditados>({})
  const [salvoComSucesso, setSalvoComSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const totalAlteracoes = Object.values(editados).filter(
    (e) => e.valor !== e.original
  ).length

  const handleChange = useCallback(
    (tamanhoId: string, novoValor: string, original: number, produtoNome: string, tamanho: string) => {
      const valorNum = parseInt(novoValor, 10)
      if (isNaN(valorNum) || valorNum < 0) return

      setEditados((prev) => {
        if (valorNum === original) {
          const next = { ...prev }
          delete next[tamanhoId]
          return next
        }
        return {
          ...prev,
          [tamanhoId]: { valor: valorNum, original, produtoNome, tamanho },
        }
      })
      setSalvoComSucesso(false)
      setErro(null)
    },
    []
  )

  const getValorAtual = (tamanhoId: string, estoqueOriginal: number): number => {
    return editados[tamanhoId]?.valor ?? estoqueOriginal
  }

  const isAlterado = (tamanhoId: string): boolean => {
    const e = editados[tamanhoId]
    return e !== undefined && e.valor !== e.original
  }

  const handleSalvarTudo = () => {
    const alteracoes = Object.entries(editados)
      .filter(([, e]) => e.valor !== e.original)
      .map(([tamanhoId, e]) => ({
        tamanhoId,
        produtoNome: e.produtoNome,
        tamanho: e.tamanho,
        estoqueAnterior: e.original,
        estoqueNovo: e.valor,
      }))

    if (alteracoes.length === 0) return

    startTransition(async () => {
      try {
        await salvarEstoqueLote(alteracoes)
        setEditados({})
        setSalvoComSucesso(true)
        setErro(null)
        setTimeout(() => setSalvoComSucesso(false), 3000)
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Erro ao salvar estoque.')
        setSalvoComSucesso(false)
      }
    })
  }

  const handleDescartar = () => {
    setEditados({})
    setSalvoComSucesso(false)
    setErro(null)
  }

  return (
    <>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type="number"
                                min="0"
                                value={getValorAtual(tam.id, tam.estoque)}
                                onChange={(e) =>
                                  handleChange(tam.id, e.target.value, tam.estoque, produto.nome, tam.tamanho)
                                }
                                disabled={isPending}
                                className={`estoque-input ${isAlterado(tam.id) ? 'estoque-input--alterado' : ''}`}
                                id={`estoque-${tam.id}`}
                              />
                              {isAlterado(tam.id) && (
                                <span className="estoque-badge-alterado">
                                  {editados[tam.id].original} → {editados[tam.id].valor}
                                </span>
                              )}
                            </div>
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

      {/* Toast de sucesso */}
      {salvoComSucesso && (
        <div className="toast-sucesso">
          <Check size={16} />
          Estoque atualizado com sucesso!
        </div>
      )}

      {/* Toast de erro */}
      {erro && (
        <div className="toast-erro">
          {erro}
        </div>
      )}

      {/* Barra fixa de salvar */}
      {totalAlteracoes > 0 && (
        <div className="barra-salvar">
          <div className="barra-salvar-inner">
            <span className="barra-salvar-info">
              <span className="barra-salvar-badge">{totalAlteracoes}</span>
              {totalAlteracoes === 1 ? 'alteração pendente' : 'alterações pendentes'}
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleDescartar}
                disabled={isPending}
                className="btn-descartar"
              >
                <RotateCcw size={14} />
                Descartar
              </button>
              <button
                onClick={handleSalvarTudo}
                disabled={isPending}
                className="btn-salvar-tudo"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Salvar Tudo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
