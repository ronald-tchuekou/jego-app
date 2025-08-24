import { z } from 'zod'

export const createJobFormSchema = z.object({
   title: z.string().min(1, 'Le titre est requis').max(255, 'Le titre ne doit pas dépasser 255 caractères'),
   description: z
      .string()
      .min(1, 'La description est requise'),
   companyName: z.string().optional(),
   companyLogo: z.string().optional(),
   companyWebsite: z.string().optional(),
   companyEmail: z.email('Email invalide').optional(),
   companyPhone: z.string().optional(),
   companyAddress: z.string().optional(),
   companyCity: z.string().optional(),
   companyState: z.string().optional(),
   companyZip: z.string().optional(),
   companyCountry: z.string().optional(),
   expiresAt: z.date().optional(),
})

export type CreateJobFormSchema = z.infer<typeof createJobFormSchema>

export const defaultCreateJobFormValue: CreateJobFormSchema = {
   title: '',
   description: '',
   companyName: '',
   companyLogo: '',
   companyWebsite: '',
   companyEmail: '',
   companyPhone: '',
   companyAddress: '',
   companyCity: '',
   companyState: '',
   companyZip: '',
   companyCountry: '',
   expiresAt: undefined,
}
