'use server'

import { CHART_PERIODS } from '@/lib/constants'
import { authenticatedActionClient } from '@/lib/safe-action'
import JobService from '@/services/job-service'

const date_enum = CHART_PERIODS.map((period) => period.value)

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
      // TODO: Implement application count
      console.log(ctx)

      return {
         count: 0,
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
