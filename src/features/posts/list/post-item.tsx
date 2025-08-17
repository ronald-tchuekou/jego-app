'use client'

import ImageWithLoading from '@/components/base/image-with-loading'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatDate } from '@/lib/utils'
import { PostModel } from '@/services/post-service'
import { CircleIcon } from 'lucide-react'
import PostItemActions from './post-item-actions'

type Props = {
   post: PostModel
}

const PostItem = ({ post }: Props) => {
   const getStatusColor = (status: string) => {
      switch (status) {
         case 'published':
            return 'text-green-600 fill-green-500'
         case 'draft':
            return 'text-yellow-600 fill-yellow-500'
         case 'archived':
            return 'text-gray-600 fill-gray-500'
         default:
            return 'text-gray-600 fill-gray-500'
      }
   }

   const getStatusLabel = (status: string) => {
      switch (status) {
         case 'published':
            return 'Publié'
         case 'draft':
            return 'Brouillon'
         case 'archived':
            return 'Archivé'
         default:
            return status
      }
   }

   return (
      <Card className='py-0'>
         <CardContent className='p-0 h-full flex flex-col relative'>
            {post.image && (
               <div className='relative w-full aspect-video border rounded-t-lg overflow-hidden'>
                  <ImageWithLoading
                     src={post.image}
                     alt={post.title}
                     width={400}
                     height={300}
                     className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'
                  />
               </div>
            )}

            <div className='flex-1 space-y-3 p-4'>
               <div className='space-y-2'>
                  <h3 className='text-lg font-semibold line-clamp-2 leading-tight'>{post.title}</h3>
                  <p className='text-sm text-muted-foreground line-clamp-3'>{post.description}</p>
               </div>

               <div className='space-y-2'>
                  <div className='flex flex-wrap gap-2'>
                     <Badge variant='outline'>{post.category}</Badge>
                     <Badge variant='outline'>{post.type}</Badge>
                  </div>

                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                     <span>
                        Par <span className='font-bold'>{post.user?.displayName || 'Anonyme'}</span>
                     </span>
                     <span>{formatDate(post.createdAt)}</span>
                  </div>

                  <div className='flex items-center justify-between'>
                     <div className='flex items-center gap-2'>
                        <CircleIcon className={cn('size-2 stroke-0', getStatusColor(post.status))} />
                        <span className={cn('text-sm', getStatusColor(post.status))}>
                           {getStatusLabel(post.status)}
                        </span>
                     </div>
                  </div>
               </div>
            </div>
            <div className='absolute top-1 right-1'>
               <PostItemActions post={post} />
            </div>
         </CardContent>
      </Card>
   )
}

export default PostItem
