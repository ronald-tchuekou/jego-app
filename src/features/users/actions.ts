'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import UserService from '@/services/user-service'
import { z } from 'zod'

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
