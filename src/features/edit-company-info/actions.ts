'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import CompanyService from '@/services/company-service'
import { editCompanyInfoSchema } from './schema'

export const updateCompanyInfoAction = authenticatedActionClient
   .inputSchema(editCompanyInfoSchema)
   .metadata({ actionName: 'updateCompanyInfoAction' })
   .action(async ({ parsedInput, ctx }) => {
      try {
         if (!ctx.user.company?.id) {
            return {
               success: false,
               message: 'Aucune entreprise associée à votre compte',
            }
         }

         const updatedCompany = await CompanyService.update(ctx.user.company?.id, parsedInput, ctx.token)

         return {
            success: true,
            message: "Informations de l'entreprise mises à jour avec succès",
            data: updatedCompany,
         }
      } catch (error: any) {
         return {
            success: false,
            message: error.message || 'Une erreur est survenue lors de la mise à jour',
         }
      }
   })
