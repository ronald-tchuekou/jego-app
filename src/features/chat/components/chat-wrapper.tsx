'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ChatContacts from '@/features/chat/components/chat-contacts'
import ChatConversation from '@/features/chat/components/chat-conversation'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'

const ChatWrapper = () => {
   const query = useSearchParams()
   const conversationId = query.get('conversationId')

   return (
      <Card
         className={
            'p-0 md:p-0 w-full h-[calc(100dvh-142px)] md:h-[calc(100dvh-158px)] lg:h-[calc(100dvh-162px)] relative'
         }
      >
         <CardContent className={'p-0 md:p-0 flex h-full'}>
            <ChatContacts conversationId={conversationId} />
            <Separator orientation='vertical' className={cn('h-full hidden lg:block')} />
            <ChatConversation conversationId={conversationId} />
         </CardContent>
      </Card>
   )
}

export default ChatWrapper
