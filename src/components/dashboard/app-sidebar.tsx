'use client'

import { NavMain } from '@/components/dashboard/nav-main'
import { NavUser } from '@/components/dashboard/nav-user'
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ROUTES } from '@/lib/constants'
import Image from 'next/image'
import * as React from 'react'

const data = {
   navMain: ROUTES,
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   return (
      <Sidebar collapsible='offcanvas' {...props}>
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem className='flex items-center justify-center'>
                  <Image
                     src={'/jego-logo-red-fit.webp'}
                     alt='JeGo logo'
                     width={2010}
                     height={1200}
                     className='h-14 w-auto flex-none aspect-auto'
                  />
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />
         </SidebarContent>
         <SidebarFooter>
            <NavUser />
         </SidebarFooter>
      </Sidebar>
   )
}
