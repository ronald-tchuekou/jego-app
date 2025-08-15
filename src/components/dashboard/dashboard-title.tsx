'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactNode, useCallback } from 'react'

type Props = {
	route?: string
	withBackButton?: boolean
	title: string
	className?: string
	children?: ReactNode
	description?: string
}

export const DashboardTitle = ({ withBackButton, title, children, className, route, description }: Props) => {
	const router = useRouter()

	const backHandler = useCallback(() => {
		if (route) router.replace(route)
		else router.back()
	}, [route, router])

	return (
		<div className={cn('flex flex-col gap-2 lg:flex-row lg:items-center justify-between', className)}>
			<div className={cn('flex items-center gap-3')}>
				{withBackButton && (
					<Button variant={'outline'} size='icon' onClick={backHandler} className={'rounded-full'}>
						<ArrowLeft />
					</Button>
				)}
				<div>
					<h1 className={'text-xl md:text-2xl font-bold line-clamp-1'}>{title}</h1>
					{description && <p className='text-sm text-muted-foreground'>{description}</p>}
				</div>
			</div>
			{children}
		</div>
	)
}
