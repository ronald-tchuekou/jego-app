'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import JobApplicationService, { JobApplicationStatus } from '@/services/job-application-service'
import { UserRole } from '@/services/user-service'
import { z } from 'zod'


// Action to update application status
export const updateApplicationStatusAction = authenticatedActionClient
   .metadata({ actionName: 'updateApplicationStatusAction' })
   .inputSchema(
      z.object({
         applicationId: z.string().min(1, "L'ID de la candidature est requis"),
         status: z.enum(JobApplicationStatus),
      })
   )
   .action(async ({ parsedInput: { applicationId, status }, ctx }) => {
      try {
         // Check if user has permission to update application status
         if (ctx.user.role !== UserRole.ADMIN && ctx.user.role !== UserRole.COMPANY_ADMIN && ctx.user.role !== UserRole.COMPANY_AGENT) {
            throw new Error("Vous n'avez pas la permission de modifier le statut des candidatures")
         }

         const application = await JobApplicationService.update(
            applicationId, 
            { status: status as JobApplicationStatus },
            ctx.token
         )

         return {
            success: true,
            message: 'Statut de la candidature modifié avec succès',
            application,
         }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors de la modification du statut de la candidature')
      }
   })

// Action to delete an application
export const deleteApplicationAction = authenticatedActionClient
   .metadata({ actionName: 'deleteApplicationAction' })
   .inputSchema(
      z.object({
         applicationId: z.string().min(1, "L'ID de la candidature est requis"),
      })
   )
   .action(async ({ parsedInput: { applicationId }, ctx }) => {
      try {
         await JobApplicationService.delete(applicationId, ctx.token)
         return { success: true, message: 'Candidature supprimée avec succès' }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors de la suppression de la candidature')
      }
   })

// Action to get application statistics
export const getApplicationStatisticsAction = authenticatedActionClient
   .metadata({ actionName: 'getApplicationStatisticsAction' })
   .action(async ({ ctx }) => {
      try {
         return JobApplicationService.getStatistics(ctx.token)
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors du chargement des statistiques')
      }
   })

// Action to get applications by job id
export const getApplicationsByJobIdAction = authenticatedActionClient
   .metadata({ actionName: 'getApplicationsByJobIdAction' })
   .inputSchema(
      z.object({
         jobId: z.string().min(1, "L'ID du job est requis"),
         page: z.number().min(1).default(1),
         limit: z.number().min(1).max(100).default(10),
      })
   )
   .action(async ({ parsedInput: { jobId, page, limit }, ctx }) => {
      try {
         return JobApplicationService.getByJobId(jobId, { page, limit }, ctx.token)
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors du chargement des candidatures pour ce job')
      }
   })
