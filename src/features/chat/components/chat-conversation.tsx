'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import UserAvatar from '@/components/base/user-avatar'
import { useAuth } from '@/components/providers/auth'
import { useTransmitContext } from '@/components/providers/transmit-provider'
import { ScrollArea } from '@/components/ui/scroll-area'
import useGetMessages from '@/features/chat/hooks/use-get-messages'
import { chatKey, notificationKey } from '@/lib/query-kye'
import { cn, fmtMsgTime } from '@/lib/utils'
import ChatService, { Message, MessageType } from '@/services/chat-service'
import { useQueryClient } from '@tanstack/react-query'
import { FileTextIcon, ImageIcon, Send, VideoIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import ConversationHeader from './conversation-header'
import { InputGroup, InputGroupAddon, InputGroupButton } from '@/components/ui/input-group'
import TextareaAutosize from 'react-textarea-autosize'
import { IconPlus } from '@tabler/icons-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

type Props = {
   conversationId: string | null
}

const ChatConversation = ({ conversationId }: Props) => {
   const { isLoading, data = [] } = useGetMessages(conversationId)
   const { auth } = useAuth()
   const queryClient = useQueryClient()
   const [messageText, setMessageText] = useState('')
   const [isSending, setIsSending] = useState(false)
   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
   const messagesEndRef = useRef<HTMLDivElement>(null)

   const { isConnected, subscribe } = useTransmitContext()

   const isMyMessage = (message: Message) => {
      return message.senderId === auth?.user?.id
   }

   const sendMessage = async () => {
      if (!messageText.trim() || !conversationId || !auth?.token || isSending) return

      setIsSending(true)
      try {
         await ChatService.sendMessage(
            {
               conversationId,
               content: messageText,
               type: MessageType.TEXT,
            },
            auth.token,
         )

         setMessageText('')

         // Invalidate and refetch messages
         await queryClient.invalidateQueries({
            queryKey: chatKey.list({ label: 'messages', conversationId }),
         })

         // Also invalidate conversations to update last message
         await queryClient.invalidateQueries({
            queryKey: chatKey.list({ label: 'contacts' }),
         })
      } catch (error) {
         console.error('Failed to send message:', error)
      } finally {
         setIsSending(false)
      }
   }

   const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault()
         sendMessage()
      }
   }

   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessageText(e.target.value)

      // Send typing indicator
      if (conversationId && isConnected) {
         ChatService.sendTypingIndicator(conversationId, { isTyping: true }, auth?.token || '')

         // Clear previous timeout
         if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
         }

         // Stop typing indicator after 3 seconds
         typingTimeoutRef.current = setTimeout(() => {
            ChatService.sendTypingIndicator(conversationId, { isTyping: false }, auth?.token || '')
         }, 3000)
      }
   }

   useEffect(() => {
      if (isConnected) {
         const unsubscribeNotify = subscribe(`conversation.${conversationId}`, () => {
            queryClient.invalidateQueries({ queryKey: notificationKey.all }).then()
            queryClient.invalidateQueries({ queryKey: chatKey.all }).then()
         })

         return () => {
            unsubscribeNotify()
         }
      }
   }, [isConnected, subscribe, conversationId, queryClient])

   // Scroll to bottom when new messages arrive
   useEffect(() => {
      if (messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
   }, [])

   // Cleanup typing timeout on unmount
   useEffect(() => {
      return () => {
         if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
         }
      }
   }, [])

   return (
      <div className={cn('flex flex-col size-full', { 'hidden lg:flex': !conversationId })}>
         <ConversationHeader />
         {!conversationId ? (
            <div className='flex-1 flex items-center justify-center'>
               <EmptyContent text={'Sélectionnez une conversation pour commencer.'} />
            </div>
         ) : (
            <>
               {/* Messages Area */}
               <ScrollArea className='flex-1 p-4'>
                  {isLoading ? (
                     <LoaderContent />
                  ) : data.length === 0 ? (
                     <EmptyContent text={'Aucun message pour le moment.'} />
                  ) : (
                     <div className='space-y-4'>
                        {data.map((message: Message) => (
                           <div
                              key={message.id}
                              className={cn('flex gap-3', {
                                 'flex-row-reverse': isMyMessage(message),
                              })}
                           >
                              <UserAvatar user={message.sender} className='size-8 flex-shrink-0' />
                              <div
                                 className={cn('flex flex-col max-w-[70%]', {
                                    'items-end': isMyMessage(message),
                                 })}
                              >
                                 <div
                                    className={cn(
                                       'rounded-lg px-3 py-2 shadow-lg',
                                       isMyMessage(message) ? 'bg-primary text-primary-foreground' : 'bg-accent',
                                    )}
                                 >
                                    <p className='text-sm'>{message.content}</p>
                                    {message.attachments && message.attachments.length > 0 && (
                                       <div className='mt-2 space-y-1'>
                                          {message.attachments.map((attachment) => (
                                             <div key={attachment.id} className='text-xs opacity-75'>
                                                📎 {attachment.name}
                                             </div>
                                          ))}
                                       </div>
                                    )}
                                 </div>
                                 <span className='text-xs text-muted-foreground mt-1'>
                                    {fmtMsgTime(new Date(message.createdAt))}
                                 </span>
                              </div>
                           </div>
                        ))}
                        <div ref={messagesEndRef} />
                     </div>
                  )}
               </ScrollArea>

               {/* Message Input */}
               <div className='border-t p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                     <div className={cn('w-2 h-2 rounded-full', isConnected ? 'bg-green-500' : 'bg-red-500')} />
                     <span className='text-xs text-muted-foreground'>{isConnected ? 'Connecté' : 'Déconnecté'}</span>
                  </div>
                  <div className='flex gap-2'>
                     <InputGroup>
                        <TextareaAutosize
                           rows={1}
                           maxRows={5}
                           data-slot='input-group-control'
                           className='flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm'
                           value={messageText}
                           onChange={handleInputChange}
                           onKeyDown={handleKeyPress}
                           disabled={isSending}
                           placeholder='Tapez votre message...'
                        />
                        <InputGroupAddon align='block-end' className={'pt-0'}>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <InputGroupButton variant='outline' size='icon-sm'>
                                    <IconPlus />
                                 </InputGroupButton>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent side='top' align='start' className='[--radius:0.95rem]'>
                                 <DropdownMenuItem>
                                    <ImageIcon /> Images
                                 </DropdownMenuItem>
                                 <DropdownMenuItem>
                                    <VideoIcon /> Vidéos
                                 </DropdownMenuItem>
                                 <DropdownMenuItem>
                                    <FileTextIcon /> Documents
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                           <InputGroupButton
                              className='ml-auto'
                              size='icon-sm'
                              variant='default'
                              onClick={sendMessage}
                              disabled={!messageText.trim() || isSending}
                           >
                              <Send className='size-4' />
                           </InputGroupButton>
                        </InputGroupAddon>
                     </InputGroup>
                  </div>
               </div>
            </>
         )}
      </div>
   )
}

export default ChatConversation
