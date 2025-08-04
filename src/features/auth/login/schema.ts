import { z } from 'zod'

export const loginSchema = z.object({
	email: z.string().min(1, "L'e-mail est requis").email('Veuillez entrer une adresse e-mail valide'),
	password: z
		.string()
		.min(1, 'Le mot de passe est requis')
		.min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
	rememberMe: z.boolean().default(false).optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
