'use server'

import { actionClient, authenticatedActionClient } from '@/lib/safe-action'
import PostService from '@/services/post-service'
import { UserRole } from '@/services/user-service'
import { z } from 'zod'
import { createPostSchema, deletePostSchema, postStatusSchema, updatePostSchema } from './schemas'

// Action to get posts with pagination and filters
export const getPostsAction = actionClient
   .metadata({ actionName: 'getPostsAction' })
   .inputSchema(
      z.object({
         page: z.number().min(1).default(1),
         limit: z.number().min(1).max(100).default(12),
         search: z.string().optional(),
         category: z.string().optional(),
         type: z.string().optional(),
         status: z.string().optional(),
      }),
   )
   .action(async ({ parsedInput: { page, limit, search, category, type, status } }) => {
      try {
         const filters: FilterQuery & {
            category?: string
            type?: string
            status?: string
         } = { page, limit }

         if (search) filters.search = search

         if (category && category !== 'all') {
            filters.category = category
         }

         if (type && type !== 'all') {
            filters.type = type
         }

         if (status && status !== 'all') {
            filters.status = status
         }

         return PostService.getAll(filters)
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors du chargement des posts')
      }
   })

export const getPostByIdAction = actionClient
   .metadata({ actionName: 'getPostByIdAction' })
   .inputSchema(z.object({ postId: z.string().min(1, "L'ID du post est requis") }))
   .action(async ({ parsedInput: { postId } }) => {
      return PostService.getById(postId)
   })

// Action to create a post (authenticated users)
export const createPostAction = authenticatedActionClient
   .metadata({ actionName: 'createPostAction' })
   .inputSchema(createPostSchema)
   .action(async ({ parsedInput, ctx }) => {
      try {
         const post = await PostService.create(parsedInput, ctx.token)
         return { success: true, message: 'Post créé avec succès', post }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors de la création du post')
      }
   })

// Action to update a post (author or admin only)
export const updatePostAction = authenticatedActionClient
   .metadata({ actionName: 'updatePostAction' })
   .inputSchema(updatePostSchema)
   .action(async ({ parsedInput: { postId, ...updateData }, ctx }) => {
      try {
         const post = await PostService.update(postId, updateData, ctx.token)
         return { success: true, message: 'Post modifié avec succès', post }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors de la modification du post')
      }
   })

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
            post 
         }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors de la modification du statut du post')
      }
   })
