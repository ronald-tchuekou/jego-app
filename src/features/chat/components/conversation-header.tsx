'use client'

import UserAvatar from '@/components/base/user-avatar'
import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { chatKey } from '@/lib/query-kye'
import ChatService from '@/services/chat-service'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

const ConversationHeader = () => {
   const router = useRouter()

   const { auth } = useAuth()
   const query = useSearchParams()
   const conversationId = query.get('conversationId')

   const { isLoading, data } = useQuery({
      queryKey: chatKey.detail(conversationId || ''),
      queryFn: ({ queryKey }) => {
         const conversationId = queryKey[2]
         return ChatService.getConversation(conversationId, auth?.token || '')
      },
   })

   const otherParticipant = !data?.participants
      ? null
      : data?.participants.find((participant) => participant.userId !== auth?.user?.id)

   if (!conversationId) {
      return null
   }

   return (
      <div className='border-b px-5 py-3 flex items-center gap-2'>
         {isLoading ? (
            <>
               <Skeleton className='size-10 rounded-full flex-none' />
               <div className='space-y-2'>
                  <Skeleton className='w-32 h-4' />
                  <Skeleton className='w-20 h-2' />
               </div>
            </>
         ) : (
            <div className='flex items-center gap-3'>
               <Button
                  variant={'outline'}
                  size='icon'
                  onClick={() => router.replace('/chat')}
                  className={'rounded-full lg:hidden'}
               >
                  <ArrowLeft />
               </Button>
               <UserAvatar user={otherParticipant?.user} />
               <div className='space-y-0'>
                  <h3 className='text-lg font-bold mb-0'>
                     {otherParticipant?.user?.firstName || '- - -'} {otherParticipant?.user?.lastName || '- - -'}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                     {data?.createdAt ? formatDistanceToNow(new Date(data?.createdAt), { addSuffix: true }) : '- - -'}
                  </p>
               </div>
            </div>
         )}
      </div>
   )
}

export default ConversationHeader
