'use client'

import { Button } from '@/components/ui/button'
import { useAction } from 'next-safe-action/hooks'
import { logoutAction } from './actions'

export default function ResetLoginButton() {

   const { execute } = useAction(logoutAction)
   
	return (
		<Button onClick={() => execute()}>
			Se connecter
		</Button>
	)
}