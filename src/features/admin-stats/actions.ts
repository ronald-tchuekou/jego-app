'use server'

import { CHART_PERIODS } from '@/lib/constants'
import { authenticatedActionClient } from '@/lib/safe-action'
import CompanyService from '@/services/company-service'
import JobService from '@/services/job-service'
import PostService from '@/services/post-service'
import UserService from '@/services/user-service'
import z from 'zod'

const date_enum = CHART_PERIODS.map((period) => period.value)

export const getUserCountAction = authenticatedActionClient
   .metadata({ actionName: 'getUserCount' })
   .action(async ({ ctx }) => {
      const result = await UserService.count(ctx.token)

      return {
         count: result,
      }
   })

export const getCompanyCountAction = authenticatedActionClient
   .metadata({ actionName: 'getCompanyCount' })
   .action(async ({ ctx }) => {
      const result = await CompanyService.count(ctx.token)

      return {
         count: result,
      }
   })

export const getPostCountAction = authenticatedActionClient
   .metadata({ actionName: 'getPostCount' })
   .action(async ({ ctx }) => {
      const result = await PostService.count(ctx.token)

      return {
         count: result,
      }
   })

export const getJobCountAction = authenticatedActionClient.metadata({ actionName: 'getJobCount' }).action(async () => {
   const result = await JobService.count()

   return {
      count: result,
   }
})

export const getUserChartDataAction = authenticatedActionClient
   .metadata({ actionName: 'getUserChartData' })
   .inputSchema(z.object({ timeRange: z.enum(date_enum).optional() }))
   .action(async ({ parsedInput, ctx }) => {
      const { timeRange } = parsedInput

      let range: { startDate: string; endDate: string } | undefined

      if (timeRange) {
         range = {
            startDate: new Date(
               new Date().setDate(new Date().getDate() - parseInt(timeRange.split('d')[0])),
            ).toISOString(),
            endDate: new Date().toISOString(),
         }
      }
      const result = await UserService.chartData(ctx.token, range)

      return result
   })

export const getCompanyChartDataAction = authenticatedActionClient
   .metadata({ actionName: 'getCompanyChartData' })
   .inputSchema(z.object({ timeRange: z.string().optional() }))
   .action(async ({ parsedInput, ctx }) => {
      const { timeRange } = parsedInput

      let range: { startDate: string; endDate: string } | undefined

      if (timeRange) {
         range = {
            startDate: new Date(
               new Date().setDate(new Date().getDate() - parseInt(timeRange.split('d')[0])),
            ).toISOString(),
            endDate: new Date().toISOString(),
         }
      }
      const result = await CompanyService.chartData(ctx.token, range)

      return result
   })

export const getPostChartDataAction = authenticatedActionClient
   .metadata({ actionName: 'getPostChartData' })
   .inputSchema(z.object({ timeRange: z.string().optional() }))
   .action(async ({ parsedInput, ctx }) => {
      const { timeRange } = parsedInput

      let range: { startDate: string; endDate: string } | undefined

      if (timeRange) {
         range = {
            startDate: new Date(
               new Date().setDate(new Date().getDate() - parseInt(timeRange.split('d')[0])),
            ).toISOString(),
            endDate: new Date().toISOString(),
         }
      }
      const result = await PostService.chartData(ctx.token, range)

      return result
   })

export const getJobChartDataAction = authenticatedActionClient
   .metadata({ actionName: 'getJobChartData' })
   .inputSchema(z.object({ timeRange: z.string().optional() }))
   .action(async ({ parsedInput, ctx }) => {
      const { timeRange } = parsedInput

      let range: { startDate: string; endDate: string } | undefined

      if (timeRange) {
         range = {
            startDate: new Date(
               new Date().setDate(new Date().getDate() - parseInt(timeRange.split('d')[0])),
            ).toISOString(),
            endDate: new Date().toISOString(),
         }
      }

      const result = await JobService.chartData(ctx.token, range)

      return result
   })
