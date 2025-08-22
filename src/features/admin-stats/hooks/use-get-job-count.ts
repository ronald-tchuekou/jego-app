"use client"

import { jobKey } from "@/lib/query-kye"
import { useQuery } from "@tanstack/react-query"
import { getJobCountAction } from "../actions"

export default function useGetJobCount() {
   const { data, isLoading } = useQuery({
      queryKey: jobKey.list({label: 'job-count'}),
      async queryFn() {
         const { data, serverError } = await getJobCountAction()

         if (serverError) {
            throw new Error(serverError)
         }

         return data?.count || 0
      },
   })

   return { data, isLoading }
}
