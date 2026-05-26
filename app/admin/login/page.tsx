'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Metadata } from 'next'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    const supabase = createClient()

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) {
        setErro('E-mail ou senha inválidos.')
      } else {
        router.push('/admin/pedidos')
        router.refresh()
      }
    })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-titulo">Ana Modas</h1>
        <p className="login-subtitulo">Acesso restrito · Painel da loja</p>

        {erro && <div className="login-erro">{erro}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grupo">
            <label htmlFor="email" className="form-label">E-mail</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-grupo">
            <label htmlFor="senha" className="form-label">Senha</label>
            <input
              id="senha"
              type="password"
              className="form-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            id="btn-login"
            disabled={isPending}
          >
            {isPending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
