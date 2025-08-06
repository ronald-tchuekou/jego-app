'use server'

import { AUTH_COOKIE_EXPIRES_AT, AUTH_COOKIE_NAME } from '@/lib/constants'
import { actionClient } from '@/lib/safe-action'
import AuthService from '@/services/auth-service'
import { cookies } from 'next/headers'
import { registerSchema } from './schema'

export const registerAction = actionClient
	.schema(registerSchema)
	.metadata({ actionName: 'registerAction' })
	.action(async ({ parsedInput }) => {
		const response = await AuthService.register(parsedInput)
	
		const cookieStore = await cookies()

		const payload = JSON.stringify(response)

		cookieStore.set({
			name: AUTH_COOKIE_NAME,
			value: payload,
			httpOnly: true,
			expires: AUTH_COOKIE_EXPIRES_AT,
			path: '/',
		})

		return {
			success: true,
			message: 'Inscription réussie ! Redirection en cours...',
		}
	})
