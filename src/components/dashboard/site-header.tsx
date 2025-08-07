'use client'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ROUTES } from '@/lib/constants'
import { usePathname } from 'next/navigation'
import ThemeToggle from '../base/theme-toggle'

export function SiteHeader() {
	const pathName = usePathname()

	const path = pathName.split('/')[1]
	const title = ROUTES.find((route) => route.url.split('/')[1] === path)?.title || 'Dashboard'

	return (
		<header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
			<div className='flex w-full items-center gap-1 lg:gap-2 px-3'>
				<SidebarTrigger className='-ml-1' />
				<Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
				<h1 className='text-lg font-bold'>{title}</h1>
				<div className='ml-auto flex items-center gap-2'>
					<ThemeToggle />
				</div>
			</div>
		</header>
	)
}
