import { z } from 'zod'

export const updateImageProfileSchema = z.object({
   image: z
      .any()
      .refine((file) => !!file, 'Une image est requise')
      .refine(
         (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file?.type),
         'Seuls les formats JPEG, PNG et WebP sont acceptés',
      )
      .refine((file) => file?.size <= 2 * 1024 * 1024, "La taille de l'image ne doit pas dépasser 2MB"),
})

export type UpdateImageProfileSchema = z.infer<typeof updateImageProfileSchema>

export const defaultUpdateImageProfileValue: Partial<UpdateImageProfileSchema> = {
   image: undefined,
}
