import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProdutoCard } from '@/components/ProdutoCard'
import type { Produto } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catálogo — Ana Modas',
}

interface CatalogoPageProps {
  searchParams: Promise<{ categoria?: string }>
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const { categoria } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('produtos')
    .select('*, tamanhos(*)')
    .eq('ativo', true)
    .order('criado_em', { ascending: false })

  if (categoria === 'sesi' || categoria === 'municipal') {
    query = query.eq('categoria', categoria)
  }

  const { data: produtos, error } = await query

  if (error) {
    console.error('❌ Supabase error in CatalogoPage:', error)
  }

  return (
    <>
      <section className="catalogo-hero">
        <h1 className="catalogo-titulo">
          Ana<span> Modas</span>
        </h1>
        <p className="catalogo-subtitulo">Uniformes escolares de Cerquilho-SP com qualidade e carinho 🏫</p>
        <div className="catalogo-hero-linha" />
      </section>

      <div className="filtros">
        <Link
          href="/"
          className={`filtro-btn ${!categoria ? 'filtro-btn--ativo' : ''}`}
          id="filtro-todos"
        >
          Todos
        </Link>
        <Link
          href="/?categoria=sesi"
          className={`filtro-btn ${categoria === 'sesi' ? 'filtro-btn--ativo' : ''}`}
          id="filtro-sesi"
        >
          SESI
        </Link>
        <Link
          href="/?categoria=municipal"
          className={`filtro-btn ${categoria === 'municipal' ? 'filtro-btn--ativo' : ''}`}
          id="filtro-municipal"
        >
          Escola Municipal
        </Link>
      </div>

      {!produtos || produtos.length === 0 ? (
        <div className="estado-vazio">
          <p>Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid-produtos">
          {(produtos as Produto[]).map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </>
  )
}
