'use client'

import { useAuth } from '@/components/providers/auth'
import { companyAppointmentRequestKey } from '@/lib/query-kye'
import CompanyAppointmentRequestService from '@/services/company-appointment-request-service'
import { useQuery } from '@tanstack/react-query'

function useGetAppointment(appointmentId: string) {
   const { auth } = useAuth()

   const { data, isLoading, error } = useQuery({
      queryKey: companyAppointmentRequestKey.detail(appointmentId),
      async queryFn() {
         if (!auth?.token) {
            throw new Error('Not authenticated')
         }

         const result = await CompanyAppointmentRequestService.getById(appointmentId, auth.token)
         return result
      },
      enabled: !!appointmentId && !!auth?.token,
      staleTime: 5 * 60 * 1000, // 5 minutes
   })

   return { appointment: data, isLoading, error }
}

export default useGetAppointment
