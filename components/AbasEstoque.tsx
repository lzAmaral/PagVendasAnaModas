'use client'

import { useState } from 'react'
import { Package, History } from 'lucide-react'

interface AbasEstoqueProps {
  children: [React.ReactNode, React.ReactNode]
}

export function AbasEstoque({ children }: AbasEstoqueProps) {
  const [abaAtiva, setAbaAtiva] = useState<'estoque' | 'historico'>('estoque')

  return (
    <>
      <div className="estoque-tabs">
        <button
          className={`estoque-tab ${abaAtiva === 'estoque' ? 'estoque-tab--ativo' : ''}`}
          onClick={() => setAbaAtiva('estoque')}
        >
          <Package size={16} />
          Estoque
        </button>
        <button
          className={`estoque-tab ${abaAtiva === 'historico' ? 'estoque-tab--ativo' : ''}`}
          onClick={() => setAbaAtiva('historico')}
        >
          <History size={16} />
          Histórico
        </button>
      </div>

      <div style={{ display: abaAtiva === 'estoque' ? 'block' : 'none' }}>
        {children[0]}
      </div>
      <div style={{ display: abaAtiva === 'historico' ? 'block' : 'none' }}>
        {children[1]}
      </div>
    </>
  )
}
