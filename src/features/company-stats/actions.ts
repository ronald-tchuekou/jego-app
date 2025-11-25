'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import JobService from '@/services/job-service'

export const getPostCountAction = authenticatedActionClient
   .metadata({ actionName: 'getPostCount' })
   .action(async ({}) => {
      // TODO: Implement post count

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
