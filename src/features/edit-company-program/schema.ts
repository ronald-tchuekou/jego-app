import { z } from 'zod'

export const editCompanyProgramSchema = z.object({
   Lundi: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
   }),
   Mardi: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
   }),
   Mercredi: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
   }),
   Jeudi: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
   }),
   Vendredi: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
   }),
   Samedi: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
   }),
   Dimanche: z.object({
      open: z.string().optional(),
      close: z.string().optional(),
   }),
})

export type EditCompanyProgramSchema = z.infer<typeof editCompanyProgramSchema>

export const editCompanyProgramDefaultValues: EditCompanyProgramSchema = {
   Lundi: {
      open: '',
      close: '',
   },
   Mardi: {
      open: '',
      close: '',
   },
   Mercredi: {
      open: '',
      close: '',
   },
   Jeudi: {
      open: '',
      close: '',
   },
   Vendredi: {
      open: '',
      close: '',
   },
   Samedi: {
      open: '',
      close: '',
   },
   Dimanche: {
      open: '',
      close: '',
   },
}
