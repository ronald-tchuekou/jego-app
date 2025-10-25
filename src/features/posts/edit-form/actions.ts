'use server'

import env from '@/lib/env/client'
import { actionClient, authenticatedActionClient } from '@/lib/safe-action'
import PostService from '@/services/post-service'
import axios from 'axios'
import z from 'zod'
import { createPostFormSchema } from './schema'

export const deleteFileAction = actionClient
   .metadata({ actionName: 'deleteFileAction' })
   .inputSchema(
      z.object({
         filePath: z.string().min(1, "L'ID du fichier est requis"),
      })
   )
   .action(async ({ parsedInput: { filePath } }) => {
      const response = await axios.delete(`${env.NEXT_PUBLIC_API_URL}/v1/files/revert?filePath=${filePath}`, {})
      const data =
         response.status === 200
            ? { success: true, message: 'Fichier supprimé avec succès' }
            : { success: false, message: 'Erreur lors de la suppression du fichier' }
      return data
   })

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
