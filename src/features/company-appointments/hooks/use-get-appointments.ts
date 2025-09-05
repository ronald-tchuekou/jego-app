"use client"

import { companyAppointmentRequestKey } from "@/lib/query-kye"
import { useQuery } from "@tanstack/react-query"
import { useQueryState } from "nuqs"
import { useEffect } from "react"
import { toast } from "sonner"
import { getAppointmentsAction } from "../actions"

function useGetAppointments(options?: { justRecent?: boolean }) {
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
      async queryFn({ queryKey }) {
         const filters = JSON.parse(queryKey[2].filters)
         const result = await getAppointmentsAction(filters)

         if (result?.serverError) {
            throw new Error(result.serverError)
         }

         if (result?.validationErrors) {
            throw new Error(result.validationErrors._errors?.join(', ') || 'Erreur lors du chargement des rendez-vous')
         }

         return result?.data
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
   })

   useEffect(() => {
      if (error?.message) {
         toast.error(error.message)
      }
   }, [error])

   return { data, isLoading }
}

export default useGetAppointments
