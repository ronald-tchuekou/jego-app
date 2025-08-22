'use client'

import { userKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { getUserChartDataAction } from '../actions'

export default function useGetUserChartData() {
   const [timeRange] = useQueryState('timeRange')

   const { data, isLoading } = useQuery({
      queryKey: userKey.list({ label: 'user-chart-data', timeRange: timeRange || undefined }),
      async queryFn({ queryKey }) {
         const filters = JSON.parse(queryKey[2].filters)
         const { data, serverError, validationErrors } = await getUserChartDataAction(filters)
         console.log(data, serverError, validationErrors)
         if (serverError) {
            throw new Error(serverError)
         }

         return data || []
      },
   })

   return { data, isLoading }
}
