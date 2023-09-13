import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import '@/styles/globals.css'
import { Inter } from "next/font/google";

export const metadata = {
  title: 'Breadit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const inter = Inter({ subsets: ['latin']})

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html lang='en' className={cn('antialiased light', inter.className)}>
      <body className='min-h-screen bg-zinc-50 dark:bg-zinc-950 antialiased'>       
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            {/* @ts-expect-error server component */}
            <Navbar />

            {authModal}
            
            <div className='container max-w-7xl mx-auto h-full pt-12'>
              {children}
            </div>
          </Providers>
          <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  )
}
