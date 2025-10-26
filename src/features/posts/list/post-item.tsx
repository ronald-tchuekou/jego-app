'use client'

import PostImage from '@/components/base/post-image'
import PostVideo from '@/components/base/post-video'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, getPostTypeLabel } from '@/lib/utils'
import { PostModel } from '@/services/post-service'
import Link from 'next/link'
import PostItemActions from './post-item-actions'

type Props = {
   post: PostModel
}

const PostItem = ({ post }: Props) => {
   const mediaType = post.mediaType
   const medias = post.medias

   return (
      <Card className='py-0'>
         <CardContent className='p-0 h-full flex flex-col relative'>
            {/* For images */}
            {mediaType === 'image' && (
               <Link
                  href={`/posts/${post.id}`}
                  className='block relative w-full aspect-video border rounded-t-lg overflow-hidden'
               >
                  <PostImage images={medias} />
               </Link>
            )}

            {/* For videos */}
            {mediaType === 'video' && <PostVideo videoPaths={medias} />}

            <Link href={`/posts/${post.id}`} className='block space-y-3 p-4 group'>
               <div className='space-y-2'>
                  <h3 className='text-lg font-semibold line-clamp-2 leading-tight group-hover:text-primary'>
                     {post.title}
                  </h3>
                  <p className='text-sm text-muted-foreground line-clamp-3'>{post.description}</p>
               </div>

               <div className='space-y-2'>
                  <div className='flex flex-wrap gap-2'>
                     <Badge variant='secondary'>{getPostTypeLabel(post.type)}</Badge>
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
