"use client"

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { UserRole } from '@/services/user-service'
import { type Icon } from '@tabler/icons-react'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../providers/auth'

export type NavMainItem = {
	title: string
	url: string
	icon?: Icon | LucideIcon
	allowedRoles?: UserRole[]
}

type Props = {
	items: NavMainItem[]
}

export function NavMain({ items }: Props) {
	const { auth } = useAuth()
	const currentPath = usePathname()

	const isActive = (url: string) => {
		const path = currentPath.split('/')[1]
		return path === url.split('/')[1]
	}

	const routes = items.filter((item) => {
		if (item.allowedRoles) {
			if (auth?.user?.role) return item.allowedRoles.includes(auth?.user?.role)
			return false
		}
		return true
	})

	return (
		<SidebarGroup>
			<SidebarGroupContent className='flex flex-col gap-2'>
				<SidebarMenu>
					{routes.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								tooltip={item.title}
								variant={isActive(item.url) ? 'active' : 'default'}
								asChild
							>
								<Link href={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
