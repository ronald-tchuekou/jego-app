'use client'

import { useAuth } from '@/components/providers/auth'
import { jobKey } from '@/lib/query-kye'
import JobService from '@/services/job-service'
import { useQuery } from '@tanstack/react-query'

export default function useGetJobCount() {
   const { auth } = useAuth()

   const { data, isLoading } = useQuery({
      queryKey: jobKey.list({ label: 'job-count' }),
      async queryFn() {
         if (!auth?.user?.companyId) {
            throw new Error('Company ID not found')
         }

         const count = await JobService.count(auth.user.companyId)
         return count || 0
      },
      enabled: !!auth?.user?.companyId,
   })

   return { data, isLoading }
}
