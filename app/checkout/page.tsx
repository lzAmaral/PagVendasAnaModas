'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCarrinho } from '@/store/carrinho'
import { criarPedido } from './actions'

export default function CheckoutPage() {
  const { itens, total, limparCarrinho } = useCarrinho()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erros, setErros] = useState<{ nome?: string; telefone?: string }>({})
  const [erroGeral, setErroGeral] = useState('')

  if (itens.length === 0) {
    return (
      <div className="checkout-container">
        <h1 className="page-titulo">Finalizar Pedido</h1>
        <p style={{ color: 'var(--cinza)' }}>
          Seu carrinho está vazio.{' '}
          <Link href="/" className="btn-secondary">Ver catálogo</Link>
        </p>
      </div>
    )
  }

  function validar() {
    const novosErros: typeof erros = {}
    if (!nome.trim() || nome.trim().length < 2) novosErros.nome = 'Informe seu nome completo.'
    if (!telefone.replace(/\D/g, '').match(/^\d{10,11}$/)) novosErros.telefone = 'Informe um telefone válido com DDD.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return
    setErroGeral('')

    startTransition(async () => {
      try {
        await criarPedido({
          nome_cliente: nome.trim(),
          telefone: telefone.replace(/\D/g, ''),
          itens: itens.map((i) => ({
            produto_id: i.produto.id,
            tamanho: i.tamanho,
            quantidade: i.quantidade,
            preco_unitario: i.produto.preco,
          })),
        })
        limparCarrinho()
      } catch (err) {
        setErroGeral('Erro ao enviar pedido. Tente novamente.')
        console.error(err)
      }
    })
  }

  return (
    <div className="checkout-container">
      <h1 className="page-titulo">Finalizar Pedido</h1>

      <div className="resumo-checkout">
        <p className="resumo-checkout-titulo">Resumo do pedido</p>
        {itens.map((item) => (
          <div key={`${item.produto.id}-${item.tamanho}`} className="resumo-checkout-item">
            <span>{item.produto.nome} ({item.tamanho}) × {item.quantidade}</span>
            <span>R$ {(item.produto.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
          </div>
        ))}
        <div className="resumo-checkout-total">
          <span>Total</span>
          <span>R$ {total().toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grupo">
          <label htmlFor="nome" className="form-label">Seu nome</label>
          <input
            id="nome"
            type="text"
            className="form-input"
            placeholder="Ex: Maria da Silva"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
          />
          {erros.nome && <span className="form-erro">{erros.nome}</span>}
        </div>

        <div className="form-grupo">
          <label htmlFor="telefone" className="form-label">WhatsApp / Telefone</label>
          <input
            id="telefone"
            type="tel"
            className="form-input"
            placeholder="(XX) 9XXXX-XXXX"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            autoComplete="tel"
          />
          {erros.telefone && <span className="form-erro">{erros.telefone}</span>}
        </div>

        {erroGeral && (
          <div className="login-erro" style={{ marginBottom: '1rem' }}>{erroGeral}</div>
        )}

        <button
          type="submit"
          className="btn-primary"
          id="btn-confirmar-pedido"
          disabled={isPending}
        >
          {isPending ? 'Enviando pedido...' : 'Confirmar Pedido'}
        </button>
      </form>

      <Link href="/carrinho" className="btn-secondary">← Voltar ao carrinho</Link>
    </div>
  )
}
