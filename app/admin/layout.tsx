export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      <div className="admin-main">
        <div className="admin-topbar">
          <span className="admin-topbar-titulo">Ana Modas · Admin</span>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="btn-logout">Sair</button>
          </form>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  )
}
