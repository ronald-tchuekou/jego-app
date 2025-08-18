'use client'

import { DEFAULT_AVATAR } from '@/lib/constants'
import env from '@/lib/env/client'
import { cn } from '@/lib/utils'
import { UserModel } from '@/services/user-service'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

type Props = {
   user?: UserModel
   className?: string
}

export default function UserAvatar({ user, className }: Props) {
   const initials = `${user?.firstName.charAt(0)}${user?.lastName.charAt(0)}`
   const userProfile = user?.profileImage ? `${env.NEXT_PUBLIC_API_URL}/v1/${user?.profileImage}` : DEFAULT_AVATAR

   return (
      <Avatar className={cn('size-10 border border-primary/20 rounded-full', className)}>
         <AvatarImage src={userProfile} />
         <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
   )
}
