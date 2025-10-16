'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import UserAvatar from '@/components/base/user-avatar'
import { useAuth } from '@/components/providers/auth'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import useGetContacts from '@/features/chat/hooks/use-get-contacts'
import { cn, fmtMsgTime } from '@/lib/utils'
import { Conversation } from '@/services/chat-service'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'

type Props = {
   conversationId: string | null
}

const ChatContacts = ({ conversationId }: Props) => {
   const { auth } = useAuth()
   const { isLoading, data } = useGetContacts()

   const getOtherParticipant = (conversation: Conversation) => {
      const participant1 = conversation.participants[0]
      const participant2 = conversation.participants[1]

      if (participant1?.userId === auth?.user?.id) {
         return participant2?.user
      }

      return participant1?.user
   }

   const getLastMessage = (conversation: Conversation) => {
      return conversation.messages?.[0] // API returns last message first
   }

   return (
      <div
         className={cn('w-full lg:w-[300px] xl:w-[400px] flex-none', {
            'hidden lg:block': !!conversationId,
         })}
      >
         {/*  Header  */}
         <div className={'p-4 space-y-3'}>
            <h2 className={'text-xl lg:text-2xl font-semibold'}>Conversations</h2>
            <InputGroup>
               <InputGroupInput placeholder='Rechercher...' />
               <InputGroupAddon>
                  <SearchIcon />
               </InputGroupAddon>
            </InputGroup>
         </div>
         <Separator />
         {/*  Content  */}
         <ScrollArea className={'flex-1'}>
            {isLoading ? (
               <LoaderContent />
            ) : data?.length === 0 ? (
               <EmptyContent text={'Pas de conversation pour le moment.'} />
            ) : (
               <div className='divide-y'>
                  {data?.map((conversation) => {
                     const otherParticipant = getOtherParticipant(conversation)
                     const lastMessage = getLastMessage(conversation)
                     const isActive = conversationId === conversation.id

                     return (
                        <Link
                           key={conversation.id}
                           href={`/chat?conversationId=${conversation.id}`}
                           className={cn(
                              'flex items-center gap-3 p-2 transition-colors',
                              isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                           )}
                        >
                           <UserAvatar user={otherParticipant} className='size-12' />
                           <div className='flex-1 min-w-0'>
                              <div className='flex items-center justify-between'>
                                 <h3
                                    className={cn('font-medium line-clamp-1', { 'text-primary-foreground': isActive })}
                                 >
                                    {otherParticipant?.firstName} {otherParticipant?.lastName}
                                 </h3>
                                 {lastMessage && (
                                    <span
                                       className={cn('text-xs text-muted-foreground/80', {
                                          'text-primary-foreground/80': isActive,
                                       })}
                                    >
                                       {fmtMsgTime(new Date(lastMessage.createdAt))}
                                    </span>
                                 )}
                              </div>
                              <p
                                 className={cn('text-sm text-muted-foreground line-clamp-1', {
                                    'text-primary-foreground/80': isActive,
                                 })}
                              >
                                 {lastMessage?.content || '- - -'}
                              </p>
                           </div>
                        </Link>
                     )
                  })}
                  <div className={'h-20'} />
               </div>
            )}
         </ScrollArea>
      </div>
   )
}

export default ChatContacts
