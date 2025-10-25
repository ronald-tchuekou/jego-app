'use client'

import { useAuth } from '@/components/providers/auth'
import { userKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'

export default function useGetAppointmentCount() {
   const { auth } = useAuth()

   const { data, isLoading } = useQuery({
      queryKey: userKey.list({ label: 'appointment-count' }),
      async queryFn() {
         if (!auth?.token) {
            throw new Error('Not authenticated')
         }

         // TODO: Implement appointment count service
         // For now, return 0 as it's not implemented yet
         return 0
      },
      enabled: !!auth?.token,
   })

   return { data, isLoading }
}
