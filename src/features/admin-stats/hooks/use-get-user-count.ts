'use client'

import { useAuth } from '@/components/providers/auth'
import { userKey } from '@/lib/query-kye'
import UserService from '@/services/user-service'
import { useQuery } from '@tanstack/react-query'

export default function useGetUserCount() {
   const { auth } = useAuth()

   const { data, isLoading } = useQuery({
      queryKey: userKey.list({ label: 'user-count' }),
      async queryFn() {
         if (!auth?.token) {
            throw new Error('Not authenticated')
         }

         const count = await UserService.count(auth.token)
         return count || 0
      },
      enabled: !!auth?.token,
   })

   return { data, isLoading }
}
