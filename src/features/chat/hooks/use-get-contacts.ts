"use client"

import { useAuth } from '@/components/providers/auth'
import { chatKey } from '@/lib/query-kye'
import ChatService from '@/services/chat-service'
import { useQuery } from '@tanstack/react-query'

const useGetContacts = () => {
    const { auth } = useAuth()
    
    const { isLoading, data } = useQuery({
			queryKey: chatKey.list({ label: 'contacts' }),
			async queryFn() {
				if (!auth?.token) return []
				return ChatService.getConversations(auth.token)
			},
			enabled: !!auth?.token,
		})

    return {isLoading, data}
}

export default useGetContacts
