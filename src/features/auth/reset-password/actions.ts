'use server'

import { AUTH_COOKIE_EXPIRES_AT, AUTH_COOKIE_NAME } from '@/lib/constants'
import { actionClient } from '@/lib/safe-action'
import AuthService from '@/services/auth-service'
import { cookies } from 'next/headers'
import { resetPasswordSchema } from './schema'

export const resetPasswordAction = actionClient
	.metadata({ actionName: 'resetPasswordAction' })
	.inputSchema(resetPasswordSchema)
	.action(async ({ parsedInput }) => {
		const response = await AuthService.resetPassword(parsedInput)

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
			message: 'Votre mot de passe a été réinitialisé avec succès. Redirection vers votre compte...',
		}
	})
