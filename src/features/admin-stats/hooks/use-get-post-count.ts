"use client"

import { postKey } from "@/lib/query-kye"
import { useQuery } from "@tanstack/react-query"
import { getPostCountAction } from "../actions"

export default function useGetPostCount() {
   const { data, isLoading } = useQuery({
      queryKey: postKey.list({ label: 'get-post-count' }),
      async queryFn() {
         const { data, serverError } = await getPostCountAction()

         if (serverError) {
            throw new Error(serverError)
         }

         return data?.count || 0
      },
   })

   return { data, isLoading }
}
