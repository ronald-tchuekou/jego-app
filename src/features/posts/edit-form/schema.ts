import { PostType } from '@/services/post-service'
import { z } from 'zod'

export const createPostFormSchema = z.object({
   title: z.string().min(1, 'Le titre est requis').max(255, 'Le titre ne doit pas dépasser 255 caractères'),
   description: z
      .string()
      .min(1, 'La description est requise')
      .max(1000, 'La description ne doit pas dépasser 1000 caractères'),
   category: z.string(),
   type: z.enum(PostType, 'Le type est requis'),
   image: z.string().optional(),
})

export type CreatePostFormSchema = z.infer<typeof createPostFormSchema>

export const defaultCreatePostFormValue: CreatePostFormSchema = {
   title: '',
   description: '',
   category: '- - -',
   type: PostType.NEWS,
   image: '',
}
