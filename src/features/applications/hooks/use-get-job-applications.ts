"use client"

import { applicationKey } from "@/lib/query-kye"
import { useQuery } from "@tanstack/react-query"
import { useQueryState } from "nuqs"
import { useEffect } from "react"
import { toast } from "sonner"
import { getApplicationsAction } from "../actions"

function useGetJobApplications(options?: { justRecent?: boolean }) {
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
      async queryFn({ queryKey }) {
         const filters = JSON.parse(queryKey[2].filters)
         const result = await getApplicationsAction(filters)

         if (result?.serverError) {
            throw new Error(result.serverError)
         }

         if (result?.validationErrors) {
            throw new Error(result.validationErrors._errors?.join(', ') || 'Erreur lors du chargement des candidatures')
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

export default useGetJobApplications
