import { PostType } from '@/services/post-service'
import { z } from 'zod'

export const postStatusSchema = z.object({
   postId: z.string().min(1, "L'ID du post est requis"),
   status: z.enum(['draft', 'published', 'archived'], 'Le statut est requis'),
})

export const createPostSchema = z.object({
   title: z.string().min(1, 'Le titre est requis').max(255, 'Le titre ne doit pas dépasser 255 caractères'),
   description: z
      .string()
      .min(1, 'La description est requise')
      .max(1000, 'La description ne doit pas dépasser 1000 caractères'),
   category: z.string().min(1, 'La catégorie est requise'),
   type: z.enum(PostType, 'Le type est requis.'),
   image: z.string().optional(),
})

export const updatePostSchema = z.object({
   postId: z.string().min(1, "L'ID du post est requis"),
   title: z.string().min(1, 'Le titre est requis').max(255, 'Le titre ne doit pas dépasser 255 caractères').optional(),
   description: z
      .string()
      .min(1, 'La description est requise')
      .max(1000, 'La description ne doit pas dépasser 1000 caractères')
      .optional(),
   category: z.string().min(1, 'La catégorie est requise').optional(),
   type: z.enum(PostType, 'Le type est requis.').optional(),
   image: z.string().optional(),
})

export const deletePostSchema = z.object({
   postId: z.string().min(1, "L'ID du post est requis"),
})

export type PostStatusInput = z.infer<typeof postStatusSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type DeletePostInput = z.infer<typeof deletePostSchema>
