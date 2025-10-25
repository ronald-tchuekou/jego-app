'use client'

import { useAuth } from '@/components/providers/auth'
import { companyKey } from '@/lib/query-kye'
import CompanyService from '@/services/company-service'
import { useQuery } from '@tanstack/react-query'

export default function useGetCompanyCount() {
   const { auth } = useAuth()

   const { data, isLoading } = useQuery({
      queryKey: companyKey.list({ label: 'company-count' }),
      async queryFn() {
         if (!auth?.token) {
            throw new Error('Not authenticated')
         }

         const count = await CompanyService.count(auth.token)
         return count || 0
      },
      enabled: !!auth?.token,
   })

   return { data, isLoading }
}
