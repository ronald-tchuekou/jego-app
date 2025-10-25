'use client'

import { useAuth } from '@/components/providers/auth'
import { chatKey } from '@/lib/query-kye'
import ChatService from '@/services/chat-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const useStartConversation = () => {
   const { auth } = useAuth()
   const queryClient = useQueryClient()
   const router = useRouter()

   const mutation = useMutation({
      mutationFn: async ({ participantId }: { participantId: string }) => {
         if (!auth?.token) throw new Error('Not authenticated')

         return await ChatService.createConversation(
            {
               participantIds: [participantId],
            },
            auth.token,
         )
      },
      onSuccess: (conversation) => {
         if (conversation) {
            // Invalidate conversations list to show the updated/new one
            queryClient.invalidateQueries({
               queryKey: chatKey.list({ label: 'contacts' }),
            })

            // Navigate to the chat page with the conversation
            router.push(`/chat?conversationId=${conversation.id}`)
         }
      },
      onError: (error) => {
         console.error('Failed to start conversation:', error)
         toast.error('Impossible de démarrer la conversation')
      },
   })

   return {
      startConversation: mutation.mutate,
      isStarting: mutation.isPending,
      error: mutation.error,
   }
}

export default useStartConversation
