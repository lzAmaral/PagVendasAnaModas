import type { Metadata } from 'next'
import { Nunito, Nunito_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'

const nunito = Nunito({
  weight: ['700', '800'],
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const nunitoSans = Nunito_Sans({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ana Modas  Uniformes de qualidade',
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
    <html lang="pt-BR" className={`${nunito.variable} ${nunitoSans.variable}`}>
      <body>
        <Header />
        <main className="main-content">{children}</main>
        <footer className="footer">
          <p>© 2026 Ana Modas</p>
        </footer>
      </body>
    </html>
  )
}
