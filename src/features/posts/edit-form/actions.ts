'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import PostService from '@/services/post-service'
import z from 'zod'
import { createPostFormSchema } from './schema'

export const createPostFormAction = authenticatedActionClient
   .inputSchema(createPostFormSchema)
   .metadata({ actionName: 'createPostFormAction' })
   .action(async ({ parsedInput, ctx }) => {
      const post = await PostService.create({ ...parsedInput, status: 'published' }, ctx.token)

      return {
         success: true,
         message: 'Post créé avec succès',
         post,
      }
   })

// Action to update a post (author or admin only)
export const updatePostAction = authenticatedActionClient
   .metadata({ actionName: 'updatePostAction' })
   .inputSchema(
      z.object({
         postId: z.string().min(1, "L'ID du post est requis"),
         ...createPostFormSchema.shape,
      }),
   )
   .action(async ({ parsedInput: { postId, ...updateData }, ctx }) => {
      const post = await PostService.update(postId, updateData, ctx.token)
      return { success: true, message: 'Post modifié avec succès', post }
   })
