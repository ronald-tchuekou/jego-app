'use server'

import { CHART_DATA } from '@/lib/constants'
import { authenticatedActionClient } from '@/lib/safe-action'
import z from 'zod'

export const getUserCountAction = authenticatedActionClient
   .metadata({ actionName: 'getUserCount' })
   .action(async ({ ctx }) => {
      // TODO: Get user count

      // Wait 1 seconds
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
         count: 1020,
      }
   })

export const getCompanyCountAction = authenticatedActionClient
   .metadata({ actionName: 'getCompanyCount' })
   .action(async ({ ctx }) => {
      // TODO: Get company count

      // Wait 1 seconds
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
         count: 10,
      }
   })

export const getPostCountAction = authenticatedActionClient
   .metadata({ actionName: 'getPostCount' })
   .action(async ({ ctx }) => {
      // TODO: Get post count

      // Wait 1 seconds
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
         count: 234,
      }
   })

export const getJobCountAction = authenticatedActionClient
   .metadata({ actionName: 'getJobCount' })
   .action(async ({ ctx }) => {
      // TODO: Get job count

      // Wait 1 seconds
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
         count: 130,
      }
   })

export const getUserChartDataAction = authenticatedActionClient
   .metadata({ actionName: 'getUserChartData' })
   .inputSchema(z.object({ timeRange: z.string().optional() }))
   .action(async ({ parsedInput, ctx }) => {
      // TODO: Get user chart data

      // Wait 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return CHART_DATA
   })

export const getCompanyChartDataAction = authenticatedActionClient
   .metadata({ actionName: 'getCompanyChartData' })
   .inputSchema(z.object({ timeRange: z.string().optional() }))
   .action(async ({ parsedInput, ctx }) => {
      // TODO: Get company chart data

      // Wait 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return CHART_DATA
   })

export const getPostChartDataAction = authenticatedActionClient
   .metadata({ actionName: 'getPostChartData' })
   .inputSchema(z.object({ timeRange: z.string().optional() }))
   .action(async ({ parsedInput, ctx }) => {
      // TODO: Get post chart data

      // Wait 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return CHART_DATA
   })

export const getJobChartDataAction = authenticatedActionClient
   .metadata({ actionName: 'getJobChartData' })
   .inputSchema(z.object({ timeRange: z.string().optional() }))
   .action(async ({ parsedInput, ctx }) => {
      // TODO: Get job chart data

      // Wait 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return CHART_DATA
   })
   