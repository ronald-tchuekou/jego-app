'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import { postKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { getPostByIdAction } from '../actions'
import CreatePostForm from './create-post-form'

type Props = {
   postId: string
}

function EditPostWrapper({ postId }: Props) {
   const { data, isLoading } = useQuery({
      queryKey: postKey.detail(postId),
      async queryFn({ queryKey }) {
         const id = queryKey[2]
         const result = await getPostByIdAction({ postId: id })
         if (result.serverError) throw new Error(result.serverError)
         return result.data
      },
   })

   if (isLoading) return <LoaderContent />

   if (!data) return <EmptyContent text="Le post que vous recherchez n'existe pas." />

   return <CreatePostForm post={data} />
}

export default EditPostWrapper
