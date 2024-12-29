import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Tools Hub',
  description: 'A comprehensive AI tools website using various API endpoints',
  keywords: ['AI', 'Machine Learning', 'Natural Language Processing', 'Image Generation', 'Code Generation'],
  authors: [{ name: 'AI Tools Hub Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-tools-hub.com',
    siteName: 'AI Tools Hub',
    images: [
      {
        url: 'https://ai-tools-hub.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tools Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AIToolsHub',
    creator: '@AIToolsHub',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

