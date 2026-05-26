'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingBag, Check } from 'lucide-react'
import type { Produto } from '@/lib/types'
import { useCarrinho } from '@/store/carrinho'
import { SeletorTamanho } from './SeletorTamanho'
import { ContadorQuantidade } from './ContadorQuantidade'

interface ProdutoCardProps {
  produto: Produto
}

export function ProdutoCard({ produto }: ProdutoCardProps) {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(null)
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)
  const adicionarItem = useCarrinho((s) => s.adicionarItem)

  const tamanhoObj = produto.tamanhos.find((t) => t.tamanho === tamanhoSelecionado)
  const estoqueMax = tamanhoObj?.estoque ?? 99

  function handleAdicionar() {
    if (!tamanhoSelecionado) return
    adicionarItem(produto, tamanhoSelecionado, quantidade)
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 1800)
    setQuantidade(1)
  }

  return (
    <article className="produto-card">
      <div className="produto-imagem-wrapper">
        {produto.foto_url ? (
          <Image
            src={produto.foto_url}
            alt={produto.nome}
            fill
            className="produto-imagem"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="produto-imagem-placeholder">
            <ShoppingBag size={40} />
          </div>
        )}
        <span className="produto-categoria">{produto.categoria}</span>
      </div>

      <div className="produto-info">
        <h2 className="produto-nome">{produto.nome}</h2>
        <p className="produto-preco">
          R$ {produto.preco.toFixed(2).replace('.', ',')}
        </p>

        <div className="produto-tamanhos-label">Tamanho</div>
        <SeletorTamanho
          tamanhos={produto.tamanhos}
          selecionado={tamanhoSelecionado}
          onChange={setTamanhoSelecionado}
        />

        {tamanhoSelecionado && (
          <div className="produto-acoes">
            <ContadorQuantidade
              quantidade={quantidade}
              onChange={setQuantidade}
              max={estoqueMax}
            />
            <button
              className={`btn-adicionar ${adicionado ? 'btn-adicionar--ok' : ''}`}
              onClick={handleAdicionar}
              disabled={!tamanhoSelecionado}
              id={`adicionar-${produto.id}`}
            >
              {adicionado ? (
                <>
                  <Check size={16} /> Adicionado!
                </>
              ) : (
                <>
                  <ShoppingBag size={16} /> Adicionar
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
