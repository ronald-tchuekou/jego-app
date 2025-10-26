'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, getPostTypeLabel } from '@/lib/utils'
import { PostModel } from '@/services/post-service'
import { ImageIcon, Video } from 'lucide-react'
import Link from 'next/link'
import PostItemActions from './post-item-actions'

type Props = {
   post: PostModel
}

const PostItem = ({ post }: Props) => {
   const mediaType = post.mediaType

   return (
      <Card className='py-0 overflow-hidden'>
         <CardContent className='p-0 h-full flex flex-col relative'>
            <Link href={`/posts/${post.id}`} className='block space-y-3 p-4 group'>
               <p className='text-sm text-muted-foreground line-clamp-3'>{post.description}</p>

               <div className='space-y-2'>
                  <div className='flex flex-wrap gap-2'>
                     <Badge variant='secondary'>{getPostTypeLabel(post.type)}</Badge>
                     {post.medias.length > 0 ? (
                        mediaType === 'image' ? (
                           <Badge>
                              {' '}
                              <ImageIcon /> Image
                           </Badge>
                        ) : mediaType === 'video' ? (
                           <Badge>
                              <Video /> Video
                           </Badge>
                        ) : null
                     ) : null}
                  </div>

                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                     <p className='line-clamp-1 w-full'>
                        Par{' '}
                        <span className='font-bold'>
                           {post.user?.company?.name || post.user?.displayName || 'Anonyme'}
                        </span>
                     </p>
                     <p className='text-xs flex-none'>{formatDate(post.createdAt)}</p>
                  </div>
               </div>
            </Link>
            <div className='absolute top-1 right-1'>
               <PostItemActions post={post} />
            </div>
         </CardContent>
      </Card>
   )
}

export default PostItem
