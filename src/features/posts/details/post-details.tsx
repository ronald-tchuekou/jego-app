'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import { useAuth } from '@/components/providers/auth'
import { postKey } from '@/lib/query-kye'
import PostService from '@/services/post-service'
import { UserRole } from '@/services/user-service'
import { useQuery } from '@tanstack/react-query'
import { PostDetailsAdmin } from './post-details-admin'
import { PostDetailsUser } from './post-details-user'

type Props = {
   postId: string
}

export default function PostDetails({ postId }: Props) {
   const { auth } = useAuth()

   const { data, isLoading } = useQuery({
      queryKey: postKey.detail(postId),
      async queryFn() {
         const result = await PostService.getById(postId)
         return result
      },
   })

   if (isLoading) return <LoaderContent />

   if (!data) return <EmptyContent text="Le post que vous recherchez n'existe pas ou a été supprimé." />

   // Check if user is admin or has admin privileges
   const isAdmin = auth?.user && auth.user.role === UserRole.ADMIN
   const canEdit = auth?.user && data.user.companyId === auth.user.companyId

   return isAdmin || canEdit ? <PostDetailsAdmin post={data} /> : <PostDetailsUser post={data} />
}
