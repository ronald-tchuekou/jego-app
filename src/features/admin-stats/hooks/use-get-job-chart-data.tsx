'use client'

import { CHART_PERIODS } from '@/lib/constants'
import { jobKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { getJobChartDataAction } from '../actions'

export default function useGetJobChartData() {
   const [timeRange] = useQueryState('timeRange', { defaultValue: CHART_PERIODS[0].value })

   const { data, isLoading } = useQuery({
      queryKey: jobKey.list({ label: 'job-chart-data', timeRange: timeRange || undefined }),
      async queryFn({ queryKey }) {
         const filters = JSON.parse(queryKey[2].filters)
         const { data, serverError, validationErrors } = await getJobChartDataAction(filters)

         if (serverError) {
            throw new Error(serverError)
         }

         if (validationErrors?._errors) {
            throw new Error(validationErrors._errors.join(', '))
         }

         return data
      },
   })

   return { data, isLoading }
}
