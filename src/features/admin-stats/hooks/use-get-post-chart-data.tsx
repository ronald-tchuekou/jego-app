'use client'

import { postKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { getPostChartDataAction } from '../actions'

export default function useGetPostChartData() {
   const [timeRange] = useQueryState('timeRange')

   const { data, isLoading } = useQuery({
      queryKey: postKey.list({ label: 'post-chart-data', timeRange: timeRange || undefined }),
      async queryFn({ queryKey }) {
         const filters = JSON.parse(queryKey[2].filters)
         const { data, serverError, validationErrors } = await getPostChartDataAction(filters)
         console.log(data, serverError, validationErrors)
         if (serverError) {
            throw new Error(serverError)
         }

         return data || []
      },
   })

   return { data, isLoading }
}
