'use client'

import { useAuth } from '@/components/providers/auth'
import { chatKey } from '@/lib/query-kye'
import ChatService from '@/services/chat-service'
import { useQuery } from '@tanstack/react-query'

const useGetMessages = (conversationId: string | null) => {
   const { auth } = useAuth()

   const { isLoading, data } = useQuery({
      queryKey: chatKey.list({ label: 'messages', conversationId }),
      async queryFn() {
         if (!conversationId || !auth?.token) return undefined
         return ChatService.getConversationMessages(conversationId, auth.token)
      },
      enabled: !!conversationId && !!auth?.token,
   })
   const messages = [...(data?.data || [])].reverse()
   return { isLoading, data: messages }
}

export default useGetMessages
