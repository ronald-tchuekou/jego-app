'use server'

import { actionClient } from '@/lib/safe-action'
import AuthService from '@/services/auth-service'
import { verifyEmailSchema } from './schema'

export const verifyEmailAction = actionClient
   .metadata({ actionName: 'verifyEmailAction' })
   .inputSchema(verifyEmailSchema)
   .action(async ({ parsedInput }) => {
      try {
         const { userId, token } = parsedInput

         await AuthService.verifyEmail(token, userId)

         return {
            success: true,
            message: `Votre adresse e-mail a été vérifiée avec succès ! Vous pouvez maintenant vous connecter.`,
         }
      } catch (error) {
         console.error(error)
         return {
            success: false,
            message: `Une erreur est survenue lors de la vérification. Le lien a peut-être expiré.`,
         }
      }
   })
