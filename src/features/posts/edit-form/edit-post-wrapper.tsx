'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import { postKey } from '@/lib/query-kye'
import PostService from '@/services/post-service'
import { useQuery } from '@tanstack/react-query'
import CreatePostForm from './create-post-form'

type Props = {
   postId: string
}

function EditPostWrapper({ postId }: Props) {
   const { data, isLoading } = useQuery({
      queryKey: postKey.detail(postId),
      async queryFn() {
         const result = await PostService.getById(postId)
         return result
      },
   })

   if (isLoading) return <LoaderContent />

   if (!data) return <EmptyContent text="Le post que vous recherchez n'existe pas." />

   return <CreatePostForm post={data} />
}

export default EditPostWrapper
