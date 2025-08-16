import { z } from 'zod'

export const editCategorySchema = z.object({
   id: z.string().optional(),
   name: z.string().min(1, 'Veuillez indiquer le nom de la catégorie.'),
   description: z.string().optional(),
})

export type EditCategorySchema = z.infer<typeof editCategorySchema>

export const defaultEditCategoryValue: EditCategorySchema = {
   id: undefined,
   name: '',
   description: '',
}
