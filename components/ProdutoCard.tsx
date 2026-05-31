'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingBag, Check } from 'lucide-react'
import type { ProdutoAgrupado } from '@/lib/types'
import { useCarrinho } from '@/store/carrinho'
import { SeletorTamanho } from './SeletorTamanho'
import { ContadorQuantidade } from './ContadorQuantidade'

interface ProdutoCardProps {
  produto: ProdutoAgrupado
}

export function ProdutoCard({ produto }: ProdutoCardProps) {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(null)
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)
  const adicionarItem = useCarrinho((s) => s.adicionarItem)

  const opcaoObj = produto.opcoes.find((o) => o.tamanho === tamanhoSelecionado)
  const estoqueMax = opcaoObj?.estoque ?? 99

  // Se nenhum tamanho selecionado, mostra "a partir de" ou apenas o menor preço
  const menorPreco = Math.min(...produto.opcoes.map((o) => o.preco))
  const precoExibicao = opcaoObj ? opcaoObj.preco : menorPreco

  function handleAdicionar() {
    if (!tamanhoSelecionado || !opcaoObj) return
    adicionarItem(opcaoObj.produtoOriginal, tamanhoSelecionado, quantidade)
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
            alt={produto.baseNome}
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
        <h2 className="produto-nome">{produto.baseNome}</h2>
        <p className="produto-preco">
          {!opcaoObj && <span style={{fontSize: '0.8rem', color: 'var(--cinza)', fontWeight: 600}}>A partir de<br/></span>}
          R$ {precoExibicao.toFixed(2).replace('.', ',')}
        </p>

        <div className="produto-tamanhos-label">Tamanho</div>
        <SeletorTamanho
          opcoes={produto.opcoes}
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
              id={`adicionar-${produto.id_virtual}`}
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
