'use client'

import { useAuth } from '@/components/providers/auth'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { updateCompanyLocationAction } from './actions'

export default function useUpdateCompanyLocation() {
   const { revalidateAuth } = useAuth()

   const { execute, isPending } = useAction(updateCompanyLocationAction, {
      onSuccess({ data }) {
         if (data?.success) {
            toast.success(data.message)
            revalidateAuth()
         } else {
            toast.error(data.message)
         }
      },
      onError(error) {
         toast.error(error.error.serverError || 'Une erreur est survenue lors de la mise à jour')
      },
   })

   return { updateCompanyLocation: execute, isPending }
}
