import ThemeToggle from '@/components/base/theme-toggle'
import { AUTH_COOKIE_NAME } from '@/lib/constants'
import '@/styles/style.css'
import dynamic from 'next/dynamic'
import { cookies } from 'next/headers'
import Image from 'next/image'
import { redirect } from 'next/navigation'

const DynamicRipple = dynamic(() => import('@/components/magicui/ripple'))

export default async function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   const cookieStore = await cookies()
   const authKey = cookieStore.get(AUTH_COOKIE_NAME)?.value

   if (authKey) {
      return redirect('/')
   }

   return (
      <>
         <main className={`container mx-auto flex flex-col min-h-screen items-center justify-center px-4 z-0`}>
            <Image
               src={'/jego-logo-red-fit.webp'}
               width={2010}
               height={1200}
               alt='JeGo logo'
               className='h-20 w-auto mb-5 flex-none aspect-auto'
            />
            <div className='w-full max-w-md'>{children}</div>
            <div className='h-10' />
         </main>
         <div className='fixed top-5 right-5'>
            <ThemeToggle />
         </div>
         <div className='fixed top-0 left-0 h-screen w-screen z-[-1]'>
            <DynamicRipple numCircles={10} mainCircleSize={500} />
         </div>
      </>
   )
}
