'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import JobService, { JobStatus } from '@/services/job-service'
import { DateTime } from 'luxon'
import z from 'zod'
import { createJobFormSchema } from './schema'

export const createJobFormAction = authenticatedActionClient
   .inputSchema(createJobFormSchema)
   .metadata({ actionName: 'createJobFormAction' })
   .action(async ({ parsedInput, ctx }) => {
      const job = await JobService.create(
         {
            ...parsedInput,
            status: JobStatus.OPEN,
            expiresAt: parsedInput.expiresAt
               ? DateTime.fromJSDate(parsedInput.expiresAt as Date).toFormat('yyyy-MM-dd')
               : null,
         },
         ctx.token
      )
      
      return {
         success: true,
         message: 'Job créé avec succès',
         job,
      }
   })

// Action to update a job (author or admin only)
export const updateJobAction = authenticatedActionClient
   .metadata({ actionName: 'updateJobAction' })
   .inputSchema(
      z.object({
         jobId: z.string().min(1, "L'ID du job est requis"),
         ...createJobFormSchema.shape,
      })
   )
   .action(async ({ parsedInput: { jobId, ...updateData }, ctx }) => {
      const job = await JobService.update(
         jobId,
         {
            ...updateData,
            expiresAt: updateData.expiresAt
               ? DateTime.fromJSDate(updateData.expiresAt as Date).toFormat('yyyy-MM-dd')
               : null,
         },
         ctx.token
      )
      return { success: true, message: 'Job modifié avec succès', job }
   })





