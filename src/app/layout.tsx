import LogoutModal from '@/components/modals/logout-modal'
import { AuthProvider } from '@/components/providers/auth'
import QueryProviders from '@/components/providers/query-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AUTH_COOKIE_NAME } from '@/lib/constants'
import { Auth } from '@/services/auth-service'
import '@/styles/style.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { cookies } from 'next/headers'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

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
            <ThemeProvider defaultTheme='system' storageKey='ui-theme'>
               <QueryProviders>
                  <AuthProvider auth={auth}>
                     <NuqsAdapter>{children}</NuqsAdapter>
                     <Toaster richColors position='top-center' duration={6000} />
                     <LogoutModal />
                  </AuthProvider>
               </QueryProviders>
            </ThemeProvider>
         </body>
      </html>
   )
}
