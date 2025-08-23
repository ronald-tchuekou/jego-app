'use client'

import { CHART_PERIODS } from '@/lib/constants'
import { userKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { getUserChartDataAction } from '../actions'

export default function useGetUserChartData() {
   const [timeRange] = useQueryState('timeRange', { defaultValue: CHART_PERIODS[0].value })

   const { data, isLoading } = useQuery({
      queryKey: userKey.list({ label: 'user-chart-data', timeRange: timeRange || undefined }),
      async queryFn({ queryKey }) {
         const filters = JSON.parse(queryKey[2].filters)

         const { data, serverError, validationErrors } = await getUserChartDataAction(filters)

         if (serverError) {
            throw new Error(serverError)
         }

         if (validationErrors?._errors) {
            throw new Error(validationErrors._errors[0])
         }

         return data
      },
   })

   return { data, isLoading }
}
