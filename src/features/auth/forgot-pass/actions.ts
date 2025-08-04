'use server'

import actionClient from '@/lib/safe-action'
import { forgotPasswordSchema } from './schema'

export const forgotPasswordAction = actionClient
	.schema(forgotPasswordSchema)
	.metadata({ actionName: 'forgotPassword' })
	.action(async ({ parsedInput }) => {
		const { email } = parsedInput

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1500))

		// Mock forgot password logic
		// In a real app, you would:
		// 1. Check if the email exists in your database
		// 2. Generate a secure reset token
		// 3. Send a password reset email
		// 4. Store the token with expiration

		// For demo purposes, we'll simulate different scenarios
		if (email === 'notfound@example.com') {
			return {
				success: false,
				error: 'Aucun compte trouvé avec cette adresse e-mail.',
			}
		}

		// Always return success for demo (in real app, you might not want to reveal if email exists)
		return {
			success: true,
			message: `Si un compte avec ${email} existe, vous recevrez bientôt un e-mail de réinitialisation du mot de passe.`,
		}
	})
