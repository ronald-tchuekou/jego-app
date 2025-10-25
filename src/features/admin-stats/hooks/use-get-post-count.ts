'use client'

import { useAuth } from '@/components/providers/auth'
import { postKey } from '@/lib/query-kye'
import PostService from '@/services/post-service'
import { useQuery } from '@tanstack/react-query'

export default function useGetPostCount() {
   const { auth } = useAuth()

   const { data, isLoading } = useQuery({
      queryKey: postKey.list({ label: 'get-post-count' }),
      async queryFn() {
         if (!auth?.token) {
            throw new Error('Not authenticated')
         }

         const companyId = auth.user?.companyId || ''
         const count = await PostService.count(auth.token, companyId)
         return count || 0
      },
      enabled: !!auth?.token,
   })

   return { data, isLoading }
}
