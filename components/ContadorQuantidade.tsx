'use client'

import { Minus, Plus } from 'lucide-react'

interface ContadorQuantidadeProps {
  quantidade: number
  onChange: (quantidade: number) => void
  max?: number
  min?: number
}

export function ContadorQuantidade({
  quantidade,
  onChange,
  max = 99,
  min = 1,
}: ContadorQuantidadeProps) {
  return (
    <div className="contador">
      <button
        className="contador-btn"
        onClick={() => onChange(Math.max(min, quantidade - 1))}
        disabled={quantidade <= min}
        aria-label="Diminuir quantidade"
      >
        <Minus size={14} />
      </button>
      <span className="contador-valor">{quantidade}</span>
      <button
        className="contador-btn"
        onClick={() => onChange(Math.min(max, quantidade + 1))}
        disabled={quantidade >= max}
        aria-label="Aumentar quantidade"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
