"use client"

import { userKey } from "@/lib/query-kye"
import { useQuery } from "@tanstack/react-query"
import { getUserCountAction } from "../actions"

export default function useGetUserCount() {
   const { data, isLoading } = useQuery({
      queryKey: userKey.list({label: 'user-count'}),
      async queryFn() {
         const { data, serverError } = await getUserCountAction()

         if (serverError) {
            throw new Error(serverError)
         }

         return data?.count || 0
      },
   })

   return { data, isLoading }
}