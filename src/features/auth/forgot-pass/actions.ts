'use server'

import { actionClient } from '@/lib/safe-action'
import AuthService from '@/services/auth-service'
import { forgotPasswordSchema } from './schema'

export const forgotPasswordAction = actionClient
	.metadata({ actionName: 'forgotPasswordAction' })
	.inputSchema(forgotPasswordSchema)
	.action(async ({ parsedInput }) => {
		const { email } = parsedInput

		await AuthService.forgotPassword(email)

		return {
			success: true,
			message: `Le lien de réinitialisation du mot de passe a été envoyé à votre adresse e-mail.`,
		}
	})
