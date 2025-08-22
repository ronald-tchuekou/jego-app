"use client"

import { companyKey } from "@/lib/query-kye"
import { useQuery } from "@tanstack/react-query"
import { getCompanyCountAction } from "../actions"

export default function useGetCompanyCount() {
   const { data, isLoading } = useQuery({
      queryKey: companyKey.list({label: 'company-count'}),
      async queryFn() {
         const { data, serverError } = await getCompanyCountAction()

         if (serverError) {
            throw new Error(serverError)
         }

         return data?.count || 0
      },
   })

   return { data, isLoading }
}
