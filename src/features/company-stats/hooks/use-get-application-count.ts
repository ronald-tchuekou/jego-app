'use client'

import { companyKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { getApplicationCountAction } from '../actions'

export default function useGetApplicationCount() {
   const { data, isLoading } = useQuery({
      queryKey: companyKey.list({ label: 'application-count' }),
      async queryFn() {
         const { data, serverError, validationErrors } = await getApplicationCountAction()

         if (serverError) {
            throw new Error(serverError)
         }

         if (validationErrors?.formErrors) {
            throw new Error(validationErrors.formErrors.join(', '))
         }

         return data?.count || 0
      },
   })

   return { data, isLoading }
}
