import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProdutoCard } from '@/components/ProdutoCard'
import type { Produto, ProdutoAgrupado } from '@/lib/types'
import type { Metadata } from 'next'

function agruparProdutos(produtos: Produto[]): ProdutoAgrupado[] {
  const grupos = new Map<string, ProdutoAgrupado>()
  const ordemTamanhos: Record<string, number> = {
    '4': 1, '6': 2, '8': 3, '10': 4, '12': 5, '14': 6, '16': 7,
    'P': 8, 'M': 9, 'G': 10, 'GG': 11
  }

  for (const p of produtos) {
    const baseNome = p.nome.replace(/\s*\(.*?\)\s*/, '').trim()
    if (!grupos.has(baseNome)) {
      grupos.set(baseNome, {
        id_virtual: p.id,
        baseNome,
        foto_url: p.foto_url,
        categoria: p.categoria,
        opcoes: []
      })
    }

    const grupo = grupos.get(baseNome)!
    if (!grupo.foto_url && p.foto_url) {
      grupo.foto_url = p.foto_url
    }

    for (const t of p.tamanhos) {
      grupo.opcoes.push({
        id: t.id,
        tamanho: t.tamanho,
        preco: p.preco,
        estoque: t.estoque,
        produtoOriginal: p
      })
    }
  }

  const resultado = Array.from(grupos.values())
  resultado.forEach((g) => {
    g.opcoes.sort((a, b) => {
      const orderA = ordemTamanhos[a.tamanho] || 99
      const orderB = ordemTamanhos[b.tamanho] || 99
      return orderA - orderB
    })
  })

  return resultado
}

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
    console.error('Supabase error in CatalogoPage:', error)
  }

  const agrupados = agruparProdutos((produtos || []) as Produto[])

  return (
    <>
      <section className="catalogo-hero">
        <h1 className="catalogo-titulo">
          Ana<span> Modas</span>
        </h1>
        <p className="catalogo-subtitulo">Uniformes do SESI e da Escola Municipal </p>
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

      {agrupados.length === 0 ? (
        <div className="estado-vazio">
          <p>Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid-produtos">
          {agrupados.map((grupo) => (
            <ProdutoCard key={grupo.id_virtual} produto={grupo} />
          ))}
        </div>
      )}
    </>
  )
}
