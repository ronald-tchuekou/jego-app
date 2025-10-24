'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import CompanyService from '@/services/company-service'
import { z } from 'zod'

// Action to delete a company
export const deleteCompanyAction = authenticatedActionClient
   .metadata({ actionName: 'deleteCompanyAction' })
   .inputSchema(
      z.object({
         companyId: z.string().min(1, "L'ID entreprise est requis"),
      })
   )
   .action(async ({ parsedInput: { companyId }, ctx }) => {
      await CompanyService.delete(companyId, ctx.token)
      return { success: true, message: 'Entreprise supprimée avec succès' }
   })

// Action to block/unblock a company
export const toggleBlockCompanyAction = authenticatedActionClient
   .metadata({ actionName: 'toggleBlockCompany' })
   .inputSchema(
      z.object({
         companyId: z.string().min(1, "L'ID entreprise est requis"),
      })
   )
   .action(async ({ parsedInput: { companyId }, ctx }) => {
      await CompanyService.toggleBlock(companyId, ctx.token)
      return {
         success: true,
         message: "Statut de l'entreprise modifié avec succès",
      }
   })


export const toggleApproveCompanyAction = authenticatedActionClient
   .metadata({ actionName: 'toggleApproveCompanyAction' })
   .inputSchema(z.object({ companyId: z.string().min(1, "L'ID entreprise est requis") }))
   .action(async ({ parsedInput: { companyId }, ctx }) => {
      await CompanyService.toggleApprove(companyId, ctx.token)
      return {
         success: true,
         message: "Statut de l'entreprise modifié avec succès",
      }
   })
