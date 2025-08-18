'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LoaderIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { logoutAction } from './actions'

export default function ResetLoginButton() {
   const { execute, isPending } = useAction(logoutAction)

   return (
      <Button onClick={() => execute()} disabled={isPending} className='relative'>
         <LoaderIcon
            className={cn('animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', {
               'opacity-0': !isPending,
            })}
         />
         <span className={cn({ 'opacity-0': isPending })}>Je me déconnecte</span>
      </Button>
   )
}
