'use client'

import { useAuth } from '@/components/providers/auth'
import { companyAppointmentRequestKey } from '@/lib/query-kye'
import CompanyAppointmentRequestService, { AppointmentStatus } from '@/services/company-appointment-request-service'
import { UserRole } from '@/services/user-service'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { toast } from 'sonner'

function useGetAppointments(options?: { justRecent?: boolean }) {
   const { auth } = useAuth()
   const [status] = useQueryState('status')
   const [page] = useQueryState('page')
   const [limit] = useQueryState('limit')
   const [search] = useQueryState('q')
   const [dateFrom] = useQueryState('dateFrom')
   const [dateTo] = useQueryState('dateTo')

   const { data, isLoading, error } = useQuery({
      queryKey: companyAppointmentRequestKey.list({
         page: page ? parseInt(page) : 1,
         limit: options?.justRecent ? 5 : limit ? parseInt(limit) : 10,
         search: search || undefined,
         status: status || undefined,
         dateFrom: dateFrom || undefined,
         dateTo: dateTo || undefined,
      }),
      async queryFn() {
         if (!auth?.token) {
            throw new Error('Not authenticated')
         }

         const filters: FilterQuery & {
            status?: AppointmentStatus
            userId?: string
            companyId?: string
            dateFrom?: string
            dateTo?: string
         } = {
            page: page ? parseInt(page) : 1,
            limit: options?.justRecent ? 5 : limit ? parseInt(limit) : 10,
         }

         if (search) filters.search = search
         if (status && status !== 'all') filters.status = status as AppointmentStatus
         if (dateFrom) filters.dateFrom = dateFrom
         if (dateTo) filters.dateTo = dateTo

         // If user is from a company, filter by company
         if (auth.user?.companyId) {
            filters.companyId = auth.user.companyId
         }

         // If regular user, filter by user
         if (auth.user?.role === UserRole.USER) {
            filters.userId = auth.user.id
         }

         const result = await CompanyAppointmentRequestService.getAll(filters, auth.token)
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

export default useGetAppointments
