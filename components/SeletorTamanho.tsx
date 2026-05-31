'use client'

import type { OpcaoTamanho } from '@/lib/types'

interface SeletorTamanhoProps {
  opcoes: OpcaoTamanho[]
  selecionado: string | null
  onChange: (tamanho: string) => void
}

export function SeletorTamanho({ opcoes, selecionado, onChange }: SeletorTamanhoProps) {
  const disponíveis = opcoes.filter((o) => o.estoque > 0)

  if (disponíveis.length === 0) {
    return <p className="sem-estoque">Sem estoque disponível</p>
  }

  return (
    <div className="seletor-tamanho">
      {opcoes.map((o) => {
        const esgotado = o.estoque === 0
        const ativo = selecionado === o.tamanho
        return (
          <button
            key={o.id}
            onClick={() => !esgotado && onChange(o.tamanho)}
            disabled={esgotado}
            aria-label={`Tamanho ${o.tamanho}${esgotado ? ' - esgotado' : ''}`}
            className={[
              'tamanho-btn',
              ativo ? 'tamanho-btn--ativo' : '',
              esgotado ? 'tamanho-btn--esgotado' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {o.tamanho}
          </button>
        )
      })}
    </div>
  )
}
