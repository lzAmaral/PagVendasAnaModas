import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span className="admin-topbar-titulo">Ana Modas · Admin</span>
            <nav style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
              <Link href="/admin" className="nav-link">Dashboard</Link>
              <Link href="/admin/pedidos" className="nav-link">Pedidos</Link>
              <Link href="/admin/estoque" className="nav-link">Estoque</Link>
            </nav>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="btn-logout">Sair</button>
          </form>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  )
}
