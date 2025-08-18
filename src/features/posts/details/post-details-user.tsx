'use client'

import { ImageWithLoading } from '@/components/base/image-with-loading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DEFAULT_AVATAR } from '@/lib/constants'
import { formatDate, getPostTypeLabel } from '@/lib/utils'
import { PostModel } from '@/services/post-service'
import { Calendar, Eye, Tag, User } from 'lucide-react'

type Props = {
   post: PostModel
}

export function PostDetailsUser({ post }: Props) {
   return (
      <div className='w-full max-w-7xl space-y-5'>
         {/* Header Section */}
         <Card>
            <CardHeader>
               <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                  <div className='flex-1 space-y-2'>
                     <div className='flex flex-wrap items-center gap-2'>
                        <Badge variant={'secondary'}>{getPostTypeLabel(post.type)}</Badge>
                        <Badge variant='outline' className='capitalize'>
                           {post.category}
                        </Badge>
                     </div>
                     <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight'>{post.title}</h1>
                  </div>
               </div>

               {/* Meta Information */}
               <div className='flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                     <User className='h-4 w-4' />
                     <span>{post.user.displayName}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                     <Calendar className='h-4 w-4' />
                     <span>Publié le {formatDate(post.createdAt)}</span>
                  </div>
                  {post.updatedAt !== post.createdAt && (
                     <div className='flex items-center gap-2'>
                        <Eye className='h-4 w-4' />
                        <span>Modifié le {formatDate(post.updatedAt)}</span>
                     </div>
                  )}
               </div>
            </CardHeader>

            {/* Image Section */}
            {!!post.image && (
               <CardContent className='pt-0'>
                  <div className='relative aspect-video w-full overflow-hidden rounded-lg border'>
                     <ImageWithLoading
                        src={post.image}
                        alt={post.title}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
                     />
                  </div>
               </CardContent>
            )}
            <CardContent>
               <div className='prose prose-gray dark:prose-invert max-w-none'>
                  <div className='whitespace-pre-wrap text-base leading-7'>{post.description}</div>
               </div>
            </CardContent>
         </Card>

         {/* Author Information */}
         <Card>
            <CardHeader>
               <h3 className='text-lg font-semibold'>À propos de l&apos;auteur</h3>
            </CardHeader>
            <CardContent>
               <div className='flex items-start gap-4'>
                  <Avatar className='size-12'>
                     <AvatarImage
                        src={
                           post.user.profileImage
                              ? `${process.env.NEXT_PUBLIC_API_URL}/v1/${post.user.profileImage}`
                              : DEFAULT_AVATAR
                        }
                     />
                     <AvatarFallback>{post.user.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-0'>
                     <h4 className='font-medium'>{post.user.displayName}</h4>
                     <p className='text-sm text-muted-foreground'>Membre depuis {formatDate(post.user.createdAt)}</p>
                     {post.user.company && (
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                           <Tag className='h-4 w-4' />
                           <span>{post.user.company.name}</span>
                        </div>
                     )}
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   )
}
