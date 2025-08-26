import { AppProviders } from '@/components/providers/app-providers'
import { Toaster } from '@/components/ui/sonner'
import { getAuth } from '@/lib/helpers/auth-helper'
import '@/styles/style.css'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
   subsets: ['latin'],
   weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
   title: {
      default: "JeGo - Votre source d'information fiable dans tout les villes du Cameroun",
      template: '%s | JeGo',
   },
   description: "Votre source d'information fiable dans tout les villes du Cameroun",
}

const DynamicLogoutModal = dynamic(() => import('@/components/modals/logout-modal'))

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   const auth = await getAuth()

   return (
      <html lang='fr'>
         <body className={`antialiased ${roboto.className}`}>
            <AppProviders auth={auth}>
               {children}
               <Toaster richColors position='top-center' duration={6000} />
               <DynamicLogoutModal />
            </AppProviders>
         </body>
      </html>
   )
}
