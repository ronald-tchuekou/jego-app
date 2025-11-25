import { z } from 'zod'

export const editCompanyLocationSchema = z.object({
   lat: z
      .string()
      .regex(/^\d*\.?\d+$/, 'La latitude doit être un nombre')
      .optional(),
   lng: z
      .string()
      .regex(/^\d*\.?\d+$/, 'La longitude doit être un nombre')
      .optional(),
})

export type EditCompanyLocationSchema = z.infer<typeof editCompanyLocationSchema>

export const editCompanyLocationDefaultValues: EditCompanyLocationSchema = {
   lat: '',
   lng: '',
}
