'use client'

import { jobKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { getJobChartDataAction } from '../actions'

export default function useGetJobChartData() {
   const [timeRange] = useQueryState('timeRange')

   const { data, isLoading } = useQuery({
      queryKey: jobKey.list({ label: 'job-chart-data', timeRange: timeRange || undefined }),
      async queryFn({ queryKey }) {
         const filters = JSON.parse(queryKey[2].filters)
         const { data, serverError, validationErrors } = await getJobChartDataAction(filters)
         console.log(data, serverError, validationErrors)
         if (serverError) {
            throw new Error(serverError)
         }

         return data || []
      },
   })

   return { data, isLoading }
}
