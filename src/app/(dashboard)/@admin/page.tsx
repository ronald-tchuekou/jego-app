import LogoutButton from '@/components/base/logout-button'
import ThemeToggle from '@/components/base/theme-toggle'
import UserOptions from '@/components/base/user-options'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminPage() {
	return (
		<Card className='m-5'>
			<CardContent className='relative'>
				<div className='flex flex-col gap-2'>
					<UserOptions />
				</div>
				<div className='absolute -top-2 right-2'>
					<ThemeToggle />
					<LogoutButton />
				</div>
			</CardContent>
		</Card>
	)
}
