'use client'

import type { Tamanho } from '@/lib/types'

interface SeletorTamanhoProps {
  tamanhos: Tamanho[]
  selecionado: string | null
  onChange: (tamanho: string) => void
}

export function SeletorTamanho({ tamanhos, selecionado, onChange }: SeletorTamanhoProps) {
  const disponíveis = tamanhos.filter((t) => t.estoque > 0)

  if (disponíveis.length === 0) {
    return <p className="sem-estoque">Sem estoque disponível</p>
  }

  return (
    <div className="seletor-tamanho">
      {tamanhos.map((t) => {
        const esgotado = t.estoque === 0
        const ativo = selecionado === t.tamanho
        return (
          <button
            key={t.id}
            onClick={() => !esgotado && onChange(t.tamanho)}
            disabled={esgotado}
            aria-label={`Tamanho ${t.tamanho}${esgotado ? ' - esgotado' : ''}`}
            className={[
              'tamanho-btn',
              ativo ? 'tamanho-btn--ativo' : '',
              esgotado ? 'tamanho-btn--esgotado' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {t.tamanho}
          </button>
        )
      })}
    </div>
  )
}
