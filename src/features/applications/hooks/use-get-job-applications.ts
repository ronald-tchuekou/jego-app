"use client"

import { useAuth } from '@/components/providers/auth'
import { applicationKey } from '@/lib/query-kye'
import JobApplicationService, { JobApplicationStatus } from '@/services/job-application-service'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { toast } from 'sonner'

function useGetJobApplications(options?: { justRecent?: boolean }) {
   const { auth } = useAuth()
   const [status] = useQueryState('status')
   const [page] = useQueryState('page')
   const [limit] = useQueryState('limit')
   const [search] = useQueryState('q')

   const { data, isLoading, error } = useQuery({
      queryKey: applicationKey.list({
         page: page ? parseInt(page) : 1,
         limit: options?.justRecent ? 5 : limit ? parseInt(limit) : 10,
         search: search || undefined,
         status: status || undefined,
      }),
      async queryFn() {
         if (!auth?.token) {
            throw new Error('Not authenticated')
         }

         const filters: FilterQuery & { status?: JobApplicationStatus; companyId?: string } = {
            page: page ? parseInt(page) : 1,
            limit: options?.justRecent ? 5 : limit ? parseInt(limit) : 10,
         }

         if (search) filters.search = search
         if (status && status !== 'all') filters.status = status as JobApplicationStatus
         if (auth.user?.companyId) filters.companyId = auth.user.companyId

         const result = await JobApplicationService.getAll(filters, auth.token)
         return result
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!auth?.token,
   })

   useEffect(() => {
      if (error?.message) {
         toast.error(error.message)
      }
   }, [error])

   return { data, isLoading }
}

export default useGetJobApplications
