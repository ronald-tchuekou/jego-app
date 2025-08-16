import { z } from 'zod'

export const verifyEmailSchema = z.object({
   userId: z.uuid('Veuillez entrer un identifiant valide'),
   token: z.string().min(1, 'Veuillez entrer un token valide'),
})

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>

export const defaultVerifyEmailValue: VerifyEmailSchema = {
   userId: '',
   token: '',
}
