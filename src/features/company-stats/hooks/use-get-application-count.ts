'use client'

import { useAuth } from '@/components/providers/auth'
import { companyKey } from '@/lib/query-kye'
import JobApplicationService from '@/services/job-application-service'
import { useQuery } from '@tanstack/react-query'

export default function useGetApplicationCount() {
   const { auth } = useAuth()

   const { data, isLoading } = useQuery({
      queryKey: companyKey.list({ label: 'application-count' }),
      async queryFn() {
         if (!auth?.token) {
            throw new Error('Not authenticated')
         }

         if (!auth.user?.companyId) {
            throw new Error('Company ID is required')
         }

         const result = await JobApplicationService.getTotal({ companyId: auth.user.companyId }, auth.token)
         return result?.count || 0
      },
      enabled: !!auth?.token && !!auth.user?.companyId,
   })

   return { data, isLoading }
}
