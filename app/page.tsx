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

  if (categoria === 'adulto' || categoria === 'infantil') {
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
        <p className="catalogo-subtitulo">Uniformes para adultos e crianças com qualidade e carinho 🧵</p>
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
          href="/?categoria=adulto"
          className={`filtro-btn ${categoria === 'adulto' ? 'filtro-btn--ativo' : ''}`}
          id="filtro-adulto"
        >
          Adulto
        </Link>
        <Link
          href="/?categoria=infantil"
          className={`filtro-btn ${categoria === 'infantil' ? 'filtro-btn--ativo' : ''}`}
          id="filtro-infantil"
        >
          Infantil
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
