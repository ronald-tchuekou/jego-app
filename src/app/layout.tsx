import LoaderContent from '@/components/base/loader-content'
import { AppProviders } from '@/components/providers/app-providers'
import { Toaster } from '@/components/ui/sonner'
import { AUTH_COOKIE_NAME } from '@/lib/constants'
import { Auth } from '@/services/auth-service'
import '@/styles/style.css'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Montserrat } from 'next/font/google'
import { cookies } from 'next/headers'

const montserrat = Montserrat({
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

const DynamicLogoutModal = dynamic(() => import('@/components/modals/logout-modal'), {
   loading: () => <LoaderContent />,
})

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   const cookieStore = await cookies()
   const authKey = cookieStore.get(AUTH_COOKIE_NAME)?.value
   const auth = authKey ? (JSON.parse(authKey) as Auth) : null

   return (
      <html lang='fr'>
         <body className={`antialiased ${montserrat.className}`}>
            <AppProviders auth={auth}>
               {children}
               <Toaster richColors position='top-center' duration={6000} />
               <DynamicLogoutModal />
            </AppProviders>
         </body>
      </html>
   )
}
