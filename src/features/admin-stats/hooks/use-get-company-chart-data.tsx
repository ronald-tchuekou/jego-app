'use client'

import { companyKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { getCompanyChartDataAction } from '../actions'

export default function useGetCompanyChartData() {
   const [timeRange] = useQueryState('timeRange')

   const { data, isLoading } = useQuery({
      queryKey: companyKey.list({ label: 'company-chart-data', timeRange: timeRange || undefined }),
      async queryFn({ queryKey }) {
         const filters = JSON.parse(queryKey[2].filters)
         const { data, serverError, validationErrors } = await getCompanyChartDataAction(filters)

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
