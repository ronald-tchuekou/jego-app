"use client"

import { companyAppointmentRequestKey } from "@/lib/query-kye"
import { useQuery } from "@tanstack/react-query"
import { getAppointmentByIdAction } from "../actions"

function useGetAppointment(appointmentId: string) {
   const { data, isLoading, error } = useQuery({
      queryKey: companyAppointmentRequestKey.detail(appointmentId),
      async queryFn({ queryKey }) {
         const appointmentId = queryKey[2]
         const result = await getAppointmentByIdAction({ appointmentId })

         if (result?.serverError) {
            throw new Error(result.serverError)
         }

         if (result?.validationErrors) {
            throw new Error(
               result.validationErrors._errors?.join(', ') || 'Erreur lors du chargement du rendez-vous'
            )
         }

         return result?.data
      },
      enabled: !!appointmentId,
      staleTime: 5 * 60 * 1000, // 5 minutes
   })

   return { appointment: data, isLoading, error }
}

export default useGetAppointment
