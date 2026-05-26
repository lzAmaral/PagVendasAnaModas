'use client'

import Link from 'next/link'
import { Trash2, ShoppingBag } from 'lucide-react'
import { useCarrinho } from '@/store/carrinho'
import { ContadorQuantidade } from '@/components/ContadorQuantidade'

export default function CarrinhoPage() {
  const { itens, removerItem, atualizarQuantidade, total, totalItens } = useCarrinho()

  if (itens.length === 0) {
    return (
      <div className="carrinho-container">
        <h1 className="page-titulo">Carrinho</h1>
        <div className="carrinho-vazio">
          <ShoppingBag size={48} strokeWidth={1} style={{ margin: '0 auto 1rem', color: 'var(--cinza-claro)' }} />
          <p>Seu carrinho está vazio.</p>
          <Link href="/" className="btn-secondary">
            ← Ver catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="carrinho-container">
      <h1 className="page-titulo">Carrinho</h1>

      <div>
        {itens.map((item) => (
          <div
            key={`${item.produto.id}-${item.tamanho}`}
            className="carrinho-item"
          >
            <div className="carrinho-item-info">
              <p className="carrinho-item-nome">{item.produto.nome}</p>
              <p className="carrinho-item-detalhe">Tamanho: {item.tamanho}</p>
              <ContadorQuantidade
                quantidade={item.quantidade}
                onChange={(q) => atualizarQuantidade(item.produto.id, item.tamanho, q)}
              />
            </div>
            <p className="carrinho-item-preco">
              R$ {(item.produto.preco * item.quantidade).toFixed(2).replace('.', ',')}
            </p>
            <button
              className="btn-remover"
              onClick={() => removerItem(item.produto.id, item.tamanho)}
              aria-label={`Remover ${item.produto.nome} do carrinho`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="carrinho-resumo">
        <div className="resumo-linha">
          <span>Itens ({totalItens()})</span>
          <span>R$ {total().toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="resumo-linha resumo-total">
          <span>Total</span>
          <span>R$ {total().toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <Link href="/checkout" className="btn-primary" id="btn-finalizar-pedido">
        Finalizar Pedido
      </Link>
      <Link href="/" className="btn-secondary">
        ← Continuar comprando
      </Link>
    </div>
  )
}
