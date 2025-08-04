'use server'

import actionClient from '@/lib/safe-action'
import { loginSchema } from './schema'

export const loginAction = actionClient
	.schema(loginSchema)
	.metadata({ actionName: 'login' })
	.action(async ({ parsedInput }) => {
		const { email, password, rememberMe } = parsedInput

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1000))

		// Mock authentication logic
		// In a real app, you would:
		// 1. Hash and compare the password
		// 2. Create a session or JWT token
		// 3. Store authentication state

		// For demo purposes, we'll accept any email/password combination
		// except for a specific demo error case
		if (email === 'error@example.com') {
			return {
				success: false,
				error: 'E-mail ou mot de passe invalide. Veuillez réessayer.',
			}
		}

		if (email === 'demo@example.com' && password === 'password123') {
			// Successful login
			return {
				success: true,
				message: 'Connexion réussie ! Redirection en cours...',
				user: {
					email,
					name: 'Utilisateur Démo',
				},
			}
		}

		// Default success for any other credentials (demo purposes)
		return {
			success: true,
			message: 'Connexion réussie ! Redirection en cours...',
			user: {
				email,
				name: 'Utilisateur',
			},
		}
	})
