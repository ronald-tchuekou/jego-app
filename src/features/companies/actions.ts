'use server'

import { actionClient, authenticatedActionClient } from '@/lib/safe-action'
import CompanyService from '@/services/company-service'
import { z } from 'zod'

// Action to get companies with pagination and filters
export const getCompaniesAction = actionClient
   .metadata({ actionName: 'getCompaniesAction' })
   .inputSchema(
      z.object({
         page: z.number().min(1).default(1),
         limit: z.number().min(1).max(100).default(10),
         search: z.string().optional(),
         categoryId: z.string().optional(),
         status: z.string().optional(),
      }),
   )
   .action(async ({ parsedInput: { page, limit, search, categoryId, status } }) => {
      try {
         const filters: FilterQuery & {
            categoryId?: string
            status?: 'active' | 'blocked'
         } = { page, limit }

         if (search) filters.search = search

         if (categoryId && categoryId !== 'all') {
            filters.categoryId = categoryId
         }

         if (status && status !== 'all') {
            filters.status = status === 'blocked' ? 'blocked' : 'active'
         }

         return CompanyService.getAll(filters)
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors du chargement des entreprises')
      }
   })

export const getCompanyByIdAction = actionClient
   .metadata({ actionName: 'getCompanyByIdAction' })
   .inputSchema(z.object({ companyId: z.string().min(1, "L'ID entreprise est requis") }))
   .action(async ({ parsedInput: { companyId } }) => {
      return CompanyService.getById(companyId)
   })

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
