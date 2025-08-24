import ThemeToggle from '@/components/base/theme-toggle'
import dynamic from 'next/dynamic'

const DynamicRipple = dynamic(() => import('@/components/magicui/ripple'))
const DynamicVerifyEmailChecker = dynamic(() => import('@/features/auth/verify-email/verify-email-checker'))

type Props = Readonly<{
   searchParams: Promise<{
      token: string
      userId: string
   }>
}>

export default async function VerifyPage({ searchParams }: Props) {
   const { token, userId } = await searchParams

   return (
      <>
         <main className={`container mx-auto flex flex-col gap-5 min-h-screen items-center justify-center px-4 z-0`}>
            <div className='h-14 w-40 flex-none bg-red-500' />
            <div className='w-full max-w-md'>
               <DynamicVerifyEmailChecker token={token} userId={userId} />
            </div>
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
