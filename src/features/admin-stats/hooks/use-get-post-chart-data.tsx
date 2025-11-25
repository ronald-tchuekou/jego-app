'use client'

import { useAuth } from '@/components/providers/auth'
import { CHART_PERIODS } from '@/lib/constants'
import { postKey } from '@/lib/query-kye'
import PostService from '@/services/post-service'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'

export default function useGetPostChartData() {
   const { auth } = useAuth()
   const [timeRange] = useQueryState('timeRange', { defaultValue: CHART_PERIODS[0].value })

   const { data, isLoading } = useQuery({
      queryKey: postKey.list({ label: 'post-chart-data', timeRange: timeRange || undefined }),
      async queryFn() {
         if (!auth?.token) {
            throw new Error('Not authenticated')
         }

         let range: { startDate: string; endDate: string } | undefined

         if (timeRange) {
            range = {
               startDate: new Date(
                  new Date().setDate(new Date().getDate() - parseInt(timeRange.split('d')[0])),
               ).toISOString(),
               endDate: new Date().toISOString(),
            }
         }

         const result = await PostService.chartData(auth.token, range)
         return result
      },
      enabled: !!auth?.token,
   })

   return { data, isLoading }
}
