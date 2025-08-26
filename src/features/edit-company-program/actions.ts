'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import CompanyService from '@/services/company-service'
import { editCompanyProgramSchema } from './schema'

export const updateCompanyProgramAction = authenticatedActionClient
   .inputSchema(editCompanyProgramSchema)
   .metadata({ actionName: 'updateCompanyProgramAction' })
   .action(async ({ parsedInput, ctx }) => {
      if (!ctx.user.companyId) {
         return {
            success: false,
            message: 'Aucune entreprise associée à votre compte',
         }
      }

      const updatedCompany = await CompanyService.update(
         ctx.user.companyId,
         {
            dailyProgram: parsedInput,
         },
         ctx.token
      )

      return {
         success: true,
         message: "Programme de l'entreprise mises à jour avec succès",
         data: updatedCompany,
      }
   })
