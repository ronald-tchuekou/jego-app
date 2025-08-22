"use client"

import { userKey } from "@/lib/query-kye"
import { useQuery } from "@tanstack/react-query"
import { getUserCountAction } from "../actions"

export default function useGetUserCount() {
   const { data, isLoading } = useQuery({
      queryKey: userKey.list({label: 'user-count'}),
      async queryFn() {
         const { data, serverError, validationErrors } = await getUserCountAction()

         if (serverError) {
            throw new Error(serverError)
         }

         if (validationErrors?.formErrors) {
            throw new Error(validationErrors.formErrors.join(', '))
         }

         return data?.count || 0
      },
   })

   return { data, isLoading }
}