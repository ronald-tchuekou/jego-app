import { z } from 'zod'

export const editCompanyInfoSchema = z.object({
   name: z.string().min(1, "Le nom de l'entreprise est requis"),
   email: z.email('Veuillez entrer une adresse e-mail valide').optional(),
   phone: z.string().min(1, 'Le numéro de téléphone est requis').optional(),
   address: z.string().min(1, "L'adresse est requise").optional(),
   city: z.string().optional(),
   state: z.string().optional(),
   zipCode: z.string().optional(),
   country: z.string().optional(),
   website: z.url('Veuillez entrer une URL valide').optional().or(z.literal('')),
   facebook: z.url('Veuillez entrer une URL Facebook valide').optional().or(z.literal('')),
   instagram: z.url('Veuillez entrer une URL Instagram valide').optional().or(z.literal('')),
   twitter: z.url('Veuillez entrer une URL Twitter valide').optional().or(z.literal('')),
   linkedin: z.url('Veuillez entrer une URL LinkedIn valide').optional().or(z.literal('')),
   youtube: z.url('Veuillez entrer une URL YouTube valide').optional().or(z.literal('')),
   tiktok: z.url('Veuillez entrer une URL TikTok valide').optional().or(z.literal('')),
   description: z.string().min(1, 'La description est requise'),
})

export type EditCompanyInfoSchema = z.infer<typeof editCompanyInfoSchema>

export const editCompanyInfoDefaultValues: EditCompanyInfoSchema = {
   name: '',
   email: '',
   phone: '',
   address: '',
   city: '',
   state: '',
   zipCode: '',
   country: '',
   website: '',
   facebook: '',
   instagram: '',
   twitter: '',
   linkedin: '',
   youtube: '',
   tiktok: '',
   description: '',
}
