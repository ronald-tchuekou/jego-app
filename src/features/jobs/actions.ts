'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import JobService, { JobStatus } from '@/services/job-service'
import { UserRole } from '@/services/user-service'
import { z } from 'zod'
import { deleteJobSchema, jobStatusSchema } from './schemas'

// Action to delete a job (author or admin only)
export const deleteJobAction = authenticatedActionClient
   .metadata({ actionName: 'deleteJobAction' })
   .inputSchema(deleteJobSchema)
   .action(async ({ parsedInput: { jobId }, ctx }) => {
      try {
         await JobService.delete(jobId, ctx.token)
         return { success: true, message: 'Job supprimé avec succès' }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors de la suppression du job')
      }
   })

// Action to update job status (admin only)
export const updateJobStatusAction = authenticatedActionClient
   .metadata({ actionName: 'updateJobStatusAction' })
   .inputSchema(jobStatusSchema)
   .action(async ({ parsedInput: { jobId, status }, ctx }) => {
      try {
         // Check if user is admin
         if (ctx.user.role !== UserRole.ADMIN) {
            throw new Error('Seuls les administrateurs peuvent modifier le statut des jobs')
         }

         const job =
            status === JobStatus.OPEN
               ? await JobService.reopenOne(jobId, ctx.token)
               : await JobService.closeOne(jobId, ctx.token)

         return {
            success: true,
            message: 'Statut du job modifié avec succès',
            job,
         }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors de la modification du statut du job')
      }
   })

// Action to toggle job status
export const toggleJobStatusAction = authenticatedActionClient
   .metadata({ actionName: 'toggleJobStatusAction' })
   .inputSchema(z.object({ jobId: z.string().min(1, "L'ID du job est requis") }))
   .action(async ({ parsedInput: { jobId }, ctx }) => {
      try {
         const job = await JobService.toggleStatus(jobId, ctx.token)
         return {
            success: true,
            message: 'Statut du job modifié avec succès',
            job,
         }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors de la modification du statut du job')
      }
   })
