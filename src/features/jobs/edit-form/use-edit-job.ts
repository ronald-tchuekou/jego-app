'use client'

import { jobKey } from '@/lib/query-kye'
import { useQueryClient } from '@tanstack/react-query'
import { HookCallbacks, useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createJobFormAction, updateJobAction } from './actions'

export default function useEditJob() {
   const queryClient = useQueryClient()
   const router = useRouter()

   const options: HookCallbacks<any, any, any, any> = {
      onSuccess: ({ data }) => {
         if (data?.success) {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: jobKey.all })
            router.back()
         }
      },
      onError: ({ error }) => {
         console.error(error)
         toast.error(error.serverError || "Une erreur est survenue lors de l'édition du job", {
            duration: 8000,
         })
      },
   }

   const { execute: createJob, isPending: isCreating } = useAction(createJobFormAction, options)
   const { execute: updateJob, isPending: isUpdating } = useAction(updateJobAction, options)

   return { createJob, updateJob, isLoading: isCreating || isUpdating }
}
