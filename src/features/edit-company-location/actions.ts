'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import CompanyService from '@/services/company-service'
import z from 'zod'

export const updateCompanyLocationAction = authenticatedActionClient
   .inputSchema(
      z
         .object({
            lat: z.number(),
            lng: z.number(),
         })
         .optional(),
   )
   .metadata({ actionName: 'updateCompanyLocationAction' })
   .action(async ({ parsedInput, ctx }) => {
      if (!ctx.user.companyId) {
         return {
            success: false,
            message: 'Aucune entreprise associée à votre compte',
         }
      }

      const location = parsedInput

      if (!location) {
         return {
            success: false,
            message: 'Aucune localisation fournie',
         }
      }

      const updatedCompany = await CompanyService.update(ctx.user.companyId, { location }, ctx.token)

      return {
         success: true,
         message: "Localisation de l'entreprise mises à jour avec succès",
         data: updatedCompany,
      }
   })
