import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ana Modas — Uniformes de qualidade',
  description:
    'Loja de uniformes oficiais do SESI e Escola Municipal em Cerquilho-SP. Escolha seu tamanho, faça seu pedido pelo WhatsApp.',
  keywords: 'uniformes, loja de uniformes, sesi, municipal, cerquilho, ana modas',
  openGraph: {
    title: 'Ana Modas',
    description: 'Uniformes escolares oficiais de Cerquilho-SP',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main className="main-content">{children}</main>
        <footer className="footer">
          <p>© 2025 Ana Modas · Uniformes com carinho 🧵</p>
        </footer>
      </body>
    </html>
  )
}
