"use client"

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
import { IconInnerShadowTop } from '@tabler/icons-react'
import * as React from 'react'

const data = {
	navMain: ROUTES,
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible='offcanvas' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className='flex items-center gap-2 text-primary'>
						<IconInnerShadowTop className='!size-10' />
						<span className='text-xl font-bold'>App logo</span>
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
