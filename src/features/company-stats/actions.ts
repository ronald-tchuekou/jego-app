'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import JobApplicationService from '@/services/job-application-service'
import JobService from '@/services/job-service'

export const getAppointmentCountAction = authenticatedActionClient
   .metadata({ actionName: 'getAppointmentCount' })
   .action(async ({ ctx }) => {
      // TODO: Implement appointment count
      console.log(ctx)

      return {
         count: 0,
      }
   })

export const getApplicationCountAction = authenticatedActionClient
   .metadata({ actionName: 'getApplicationCount' })
   .action(async ({ ctx }) => {
      const companyId = ctx.user.companyId

      if (!companyId) {
         throw new Error('Company ID is required')
      }

      const result = await JobApplicationService.getTotal({ companyId }, ctx.token)

      return {
         count: result?.count ?? 0,
      }
   })

export const getPostCountAction = authenticatedActionClient
   .metadata({ actionName: 'getPostCount' })
   .action(async ({ ctx }) => {
      // TODO: Implement post count
      console.log(ctx)

      return {
         count: 0,
      }
   })

export const getJobCountAction = authenticatedActionClient
   .metadata({ actionName: 'getJobCount' })
   .action(async ({ ctx }) => {
      const companyId = ctx.user.companyId

      const result = await JobService.count(companyId || undefined)

      return {
         count: result,
      }
   })
