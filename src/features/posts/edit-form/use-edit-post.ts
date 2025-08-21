'use client'

import { postKey } from '@/lib/query-kye'
import { useQueryClient } from '@tanstack/react-query'
import { HookCallbacks, useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createPostFormAction, updatePostAction } from './actions'

export default function useEditPost() {
   const queryClient = useQueryClient()
   const router = useRouter()

   const options: HookCallbacks<any, any, any, any> = {
      onSuccess: ({ data }) => {
         if (data?.success) {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: postKey.all })
            router.back()
         }
      },
      onError: ({ error }) => {
         console.error(error)
         toast.error(error.serverError || "Une erreur est survenue lors de l'édition du post", {
            duration: 8000,
         })
      },
   }

   const { execute: createPost, isPending: isCreating } = useAction(createPostFormAction, options)
   const { execute: updatePost, isPending: isUpdating } = useAction(updatePostAction, options)

   return { createPost, updatePost, isLoading: isCreating || isUpdating }
}
