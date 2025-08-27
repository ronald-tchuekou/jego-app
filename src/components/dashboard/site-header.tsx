'use client'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ROUTES } from '@/lib/constants'
import { getUserRoleLabel } from '@/lib/utils'
import { Building } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import ThemeToggle from '../base/theme-toggle'
import { useAuth } from '../providers/auth'
import { Badge } from '../ui/badge'

export function SiteHeader() {
   const pathName = usePathname()
   const { auth } = useAuth()

   const path = pathName.split('/')[1]
   const title = ROUTES.find((route) => route.url.split('/')[1] === path)?.title || 'Dashboard'

   const CompanyName = useMemo(
      () =>
         auth?.user?.company?.name ? (
            <span className='text-primary grid grid-cols-8 gap-1 items-center'>
               <Building className='size-5 flex-none col-span-2 sm:col-span-1' />
               <span className='truncate col-span-6 sm:col-span-7'>{auth?.user?.company?.name}</span>
            </span>
         ) : null,
      [auth]
   )

   return (
      <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
         <div className='flex w-full items-center gap-1 lg:gap-2 px-3'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
            <h1 className='text-lg font-bold'>{CompanyName || title}</h1>
            <div className='ml-auto flex items-center gap-2'>
               <Badge>{getUserRoleLabel(auth?.user?.role)}</Badge>
               <ThemeToggle />
            </div>
         </div>
      </header>
   )
}
