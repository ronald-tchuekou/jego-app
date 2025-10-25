import { PostType } from '@/services/post-service'
import { z } from 'zod'
import { mediaSchema } from '../schemas'

export const createPostFormSchema = z.object({
   title: z.string().optional(),
   description: z
      .string()
      .min(1, 'La description est requise')
      .max(1000, 'La description ne doit pas dépasser 1000 caractères'),
   category: z.string(),
   type: z.enum(PostType, 'Le type est requis'),
   mediaType: z.enum(['image', 'video'], 'Le type de média est requis.').default('image').optional(),
   medias: z.array(mediaSchema).optional(),
})

export type CreatePostFormSchema = z.infer<typeof createPostFormSchema>

export const defaultCreatePostFormValue: CreatePostFormSchema = {
   title: 'Post title',
   description: '',
   category: '- - -',
   type: PostType.NEWS,
   mediaType: 'image',
   medias: undefined,
}
