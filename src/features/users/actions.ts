'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import UserService, { UserRole } from '@/services/user-service'
import { z } from 'zod'

// Action to get users with pagination and filters
export const getUsersAction = authenticatedActionClient
   .metadata({ actionName: 'getUsersAction' })
   .inputSchema(
      z.object({
         page: z.number().min(1).default(1),
         limit: z.number().min(1).max(100).default(10),
         search: z.string().optional(),
         role: z.string().optional(),
         status: z.string().optional(),
      }),
   )
   .action(async ({ parsedInput: { page, limit, search, role, status }, ctx }) => {
      try {
         const filters: FilterQuery & {
            role?: UserRole
            status?: 'active' | 'blocked'
         } = { page, limit }

         if (search) filters.search = search

         if (role && role !== 'all') {
            filters.role = role as UserRole
         }

         if (status && status !== 'all') {
            filters.status = status === 'blocked' ? 'blocked' : 'active'
         }

         return UserService.getUsers(filters, ctx.token)
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors du chargement des utilisateurs')
      }
   })

export const getUserByIdAction = authenticatedActionClient
   .metadata({ actionName: 'getUserByIdAction' })
   .inputSchema(z.object({ userId: z.string().min(1, "L'ID utilisateur est requis") }))
   .action(async ({ parsedInput: { userId }, ctx }) => {
      return UserService.getUserById(userId, ctx.token)
   })

// Action to delete a user
export const deleteUserAction = authenticatedActionClient
   .metadata({ actionName: 'deleteUserAction' })
   .inputSchema(
      z.object({
         userId: z.string().min(1, "L'ID utilisateur est requis"),
      }),
   )
   .action(async ({ parsedInput: { userId }, ctx }) => {
      try {
         await UserService.deleteUser(userId, ctx.token)
         return { success: true, message: 'Utilisateur supprimé avec succès' }
      } catch (error) {
         console.error(error)
         throw new Error("Erreur lors de la suppression de l'utilisateur")
      }
   })

// Action to block/unblock a user
export const toggleBlockUserAction = authenticatedActionClient
   .metadata({ actionName: 'toggleBlockUser' })
   .inputSchema(
      z.object({
         userId: z.string().min(1, "L'ID utilisateur est requis"),
      }),
   )
   .action(async ({ parsedInput: { userId }, ctx }) => {
      try {
         await UserService.toggleBlockUser(userId, ctx.token)
         return {
            success: true,
            message: "Statut de l'utilisateur modifié avec succès",
         }
      } catch (error) {
         console.error(error)
         throw new Error("Erreur lors de la modification du statut de l'utilisateur")
      }
   })
