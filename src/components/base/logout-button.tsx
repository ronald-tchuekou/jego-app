'use client'

import { Button } from '@/components/ui/button'
import { confirmLogout } from '@/lib/stores/logout-modal-store'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {

   return (
		<Button variant='ghost' size='icon' className='relative w-9 h-9 rounded-full' onClick={() => confirmLogout()}>
			<LogOut className='' />
		</Button>
	)
}
