import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pedido Confirmado — Ana Modas' }

interface Props {
  searchParams: Promise<{ id?: string }>
}

export default async function PedidoConfirmadoPage({ searchParams }: Props) {
  const { id } = await searchParams
  const pedidoCurto = id ? id.slice(0, 8).toUpperCase() : '—'

  return (
    <div className="confirmado-container">
      <h1 className="confirmado-titulo">Pedido recebido!</h1>
      <p className="confirmado-pedido">
        Número do pedido: <span>#{pedidoCurto}</span>
      </p>
      <div className="confirmado-info">
        <p>Sua encomenda foi registrada com sucesso.</p>
        <p>A Ana Modas entrará em contato pelo WhatsApp para confirmar e combinar a entrega.</p>
      </div>
      <Link href="/" className="btn-primary" id="btn-voltar-catalogo">
        ← Voltar ao catálogo
      </Link>
    </div>
  )
}
