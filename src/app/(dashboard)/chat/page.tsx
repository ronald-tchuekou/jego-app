import React from 'react'
import ChatWrapper from '@/features/chat/components/chat-wrapper'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'

export default function ChatPage() {
   return (
      <>
         <DashboardTitle title={'Chat'} />
         <ChatWrapper />
      </>
   )
}
