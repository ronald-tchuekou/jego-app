import { z } from 'zod'

export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(1, 'Le mot de passe est requis')
			.min(8, 'Le mot de passe doit contenir au moins 8 caractères')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre'
			),
		confirmPassword: z.string().min(1, 'Veuillez confirmer votre mot de passe'),
		token: z.string().min(1, 'Le jeton de réinitialisation est requis'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Les mots de passe ne correspondent pas',
		path: ['confirmPassword'], // This will show the error on the confirmPassword field
	})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
