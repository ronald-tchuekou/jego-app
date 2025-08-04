import { z } from 'zod'

export const forgotPasswordSchema = z.object({
	email: z.string().min(1, "L'e-mail est requis").email('Veuillez entrer une adresse e-mail valide'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
