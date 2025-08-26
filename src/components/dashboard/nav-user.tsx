'use client'

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { confirmLogout } from '@/lib/stores/logout-modal-store'
import { getUserRoleLabel } from '@/lib/utils'
import { IconDashboard, IconDotsVertical, IconLogout, IconUserCircle } from '@tabler/icons-react'
import Link from 'next/link'
import UserAvatar from '../base/user-avatar'
import { useAuth } from '../providers/auth'

type Props = {
   normal?: boolean
}

export function NavUser({ normal = false }: Props) {
   const { auth } = useAuth()
   const { isMobile } = useSidebar()

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                     size='lg'
                     className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                  >
                     <UserAvatar user={auth?.user} />
                     <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='text-lg truncate font-semibold'>{auth?.user.displayName}</span>
                        <span className='text-sm text-muted-foreground truncate'>
                           {getUserRoleLabel(auth?.user?.role)}
                        </span>
                     </div>
                     {!normal && <IconDotsVertical className='ml-auto size-4' />}
                  </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                  side={normal ? undefined : isMobile ? 'bottom' : 'right'}
                  align={normal ? undefined : 'end'}
                  sideOffset={4}
               >
                  <DropdownMenuLabel className='p-0 font-normal'>
                     <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                        <UserAvatar user={auth?.user} />
                        <div className='grid flex-1 text-left text-sm leading-tight'>
                           <span className='truncate font-medium'>{auth?.user.displayName}</span>
                           <span className='text-muted-foreground truncate text-xs'>{auth?.user.email}</span>
                        </div>
                     </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem asChild>
                        <Link href={'/'}>
                           <IconDashboard className='size-4' />
                           Tableau de bord
                        </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <Link href={'/profile'}>
                           <IconUserCircle />
                           Mon Profil
                        </Link>
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => confirmLogout()}>
                     <IconLogout className='text-destructive' />
                     <span className='text-destructive'>Déconnexion</span>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   )
}
