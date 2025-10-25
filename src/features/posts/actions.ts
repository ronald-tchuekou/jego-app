'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import PostService from '@/services/post-service'
import { UserRole } from '@/services/user-service'
import { deletePostSchema, postStatusSchema } from './schemas'

// Action to delete a post (author or admin only)
export const deletePostAction = authenticatedActionClient
   .metadata({ actionName: 'deletePostAction' })
   .inputSchema(deletePostSchema)
   .action(async ({ parsedInput: { postId }, ctx }) => {
      try {
         await PostService.delete(postId, ctx.token)
         return { success: true, message: 'Post supprimé avec succès' }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors de la suppression du post')
      }
   })

// Action to update post status (admin only)
export const updatePostStatusAction = authenticatedActionClient
   .metadata({ actionName: 'updatePostStatusAction' })
   .inputSchema(postStatusSchema)
   .action(async ({ parsedInput: { postId, status }, ctx }) => {
      try {
         // Check if user is admin
         if (ctx.user.role !== UserRole.ADMIN) {
            throw new Error('Seuls les administrateurs peuvent modifier le statut des posts')
         }

         const post = await PostService.updateStatus(postId, status, ctx.token)
         return {
            success: true,
            message: 'Statut du post modifié avec succès',
            post,
         }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors de la modification du statut du post')
      }
   })
