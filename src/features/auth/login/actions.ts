'use server'

import { AUTH_COOKIE_EXPIRES_AT, AUTH_COOKIE_NAME } from '@/lib/constants'
import { actionClient } from '@/lib/safe-action'
import AuthService from '@/services/auth-service'
import { cookies } from 'next/headers'
import { loginSchema } from './schema'

export const loginAction = actionClient
	.inputSchema(loginSchema)
	.metadata({ actionName: 'loginAction' })
	.action(async ({ parsedInput }) => {
		const response = await AuthService.login(parsedInput)
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
			message: 'Connexion réussie ! Redirection en cours...',
		}
	})
