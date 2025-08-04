'use server'

import actionClient from '@/lib/safe-action'
import { resetPasswordSchema } from './schema'

export const resetPasswordAction = actionClient
	.schema(resetPasswordSchema)
	.metadata({ actionName: 'resetPassword' })
	.action(async ({ parsedInput }) => {
		const { password, token } = parsedInput

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1000))

		// Mock reset password logic
		// In a real app, you would:
		// 1. Validate the reset token and check if it's not expired
		// 2. Hash the new password
		// 3. Update the user's password in the database
		// 4. Invalidate the reset token
		// 5. Optionally, invalidate all existing sessions

		// For demo purposes, simulate different scenarios
		if (token === 'invalid_token') {
			return {
				success: false,
				error: 'Jeton de réinitialisation invalide ou expiré. Veuillez demander une nouvelle réinitialisation de mot de passe.',
			}
		}

		if (token === 'expired_token') {
			return {
				success: false,
				error: 'Le jeton de réinitialisation a expiré. Veuillez demander une nouvelle réinitialisation de mot de passe.',
			}
		}

		// Simulate successful password reset
		return {
			success: true,
			message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
		}
	})
