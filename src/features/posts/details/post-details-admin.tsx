'use client'

import PostImage from '@/components/base/post-image'
import PostVideo from '@/components/base/post-video'
import UserAvatar from '@/components/base/user-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDate, getPostTypeLabel } from '@/lib/utils'
import { PostModel } from '@/services/post-service'
import { Calendar, EditIcon, Eye, Trash2Icon, User } from 'lucide-react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { useRef } from 'react'
import { DeletePostDialog } from '../list/post-item-actions'

type Post = {
   post: PostModel
}

export function PostDetailsAdmin({ post }: Post) {
   const deletePostModalRef = useRef<{ open: VoidFunction }>(null)

   const mediaType = post.mediaType
   const medias = post.medias

   const getRoleColor = (role: string) => {
      switch (role) {
         case 'admin':
            return 'text-red-600 dark:text-red-400'
         case 'company:admin':
            return 'text-blue-600 dark:text-blue-400'
         case 'company:agent':
            return 'text-green-600 dark:text-green-400'
         default:
            return 'text-muted-foreground'
      }
   }

   const formatRole = (role: string) => {
      switch (role) {
         case 'admin':
            return 'Administrateur'
         case 'company:admin':
            return 'Admin Entreprise'
         case 'company:agent':
            return 'Agent Entreprise'
         case 'user':
            return 'Utilisateur'
         default:
            return role
      }
   }

   return (
      <>
         <div className='w-full max-w-7xl'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
               {/* Header Section */}
               <Card className='lg:col-span-2'>
                  <CardHeader>
                     <div className='flex flex-col gap-4'>
                        <div className='flex items-center justify-between'>
                           <div className='flex flex-wrap items-center gap-2'>
                              <Badge variant={'secondary'}>{getPostTypeLabel(post.type)}</Badge>
                              <Badge variant='outline' className='capitalize'>
                                 {post.category}
                              </Badge>
                           </div>
                           <div className='flex items-center gap-1'>
                              <Button
                                 size={'icon-sm'}
                                 variant={'secondary'}
                                 onClick={() => deletePostModalRef.current?.open()}
                              >
                                 <Trash2Icon />
                              </Button>
                              <Button size={'icon-sm'} variant={'outline'} asChild>
                                 <Link href={`/posts/edit/${post.id}`}>
                                    <EditIcon />
                                 </Link>
                              </Button>
                           </div>
                        </div>
                        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight'>{post.title}</h1>
                     </div>

                     {/* Meta Information */}
                     <div className='flex flex-wrap gap-4 text-sm text-muted-foreground whitespace-nowrap'>
                        <div className='flex items-center gap-2'>
                           <User className='size-4' />
                           <span>{post.user?.company?.name || post.user?.displayName || 'Anonyme'}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                           <Calendar className='size-4' />
                           <span>Créé le {formatDate(post.createdAt)}</span>
                        </div>
                        {DateTime.fromISO(post.updatedAt).startOf('day') >
                           DateTime.fromISO(post.createdAt).startOf('day') && (
                           <div className='flex items-center gap-2 sm:col-span-2'>
                              <Eye className='size-4' />
                              <span>Dernière modification le {formatDate(post.updatedAt)}</span>
                           </div>
                        )}
                     </div>
                  </CardHeader>

                  {/* Image Section */}
                  {medias.length > 0 && (
                     <CardContent className='pt-0'>
                        {/* For images */}
                        {mediaType === 'image' && <PostImage images={medias} />}

                        {/* For videos */}
                        {mediaType === 'video' && <PostVideo videoPaths={medias} />}
                     </CardContent>
                  )}

                  {/* Content Section */}
                  <CardContent>
                     <div className='prose prose-gray dark:prose-invert max-w-none'>
                        <div className='whitespace-pre-wrap text-base leading-7'>{post.description}</div>
                     </div>
                  </CardContent>
               </Card>

               {/* Admin Sidebar */}
               <div className='space-y-6'>
                  {/* Author Information */}
                  <Card>
                     <CardHeader>
                        <CardTitle className='text-lg'>Informations Auteur</CardTitle>
                     </CardHeader>
                     <CardContent className='space-y-4'>
                        <div className='flex items-start gap-3'>
                           <UserAvatar user={post.user} className='size-12' />
                           <div className='flex-1 min-w-0'>
                              <h4 className='font-medium truncate'>{post.user.displayName}</h4>
                              <p className='text-sm truncate text-muted-foreground'>{post.user.email}</p>
                           </div>
                        </div>

                        <Separator />

                        <div className='space-y-3 text-sm'>
                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>Rôle:</span>
                              <span className={`font-medium ${getRoleColor(post.user.role)} text-right`}>
                                 {formatRole(post.user.role)}
                              </span>
                           </div>

                           {post.user.company && (
                              <div className='flex justify-between'>
                                 <span className='text-muted-foreground'>Entreprise:</span>
                                 <span className='font-medium text-right'>{post.user.company.name}</span>
                              </div>
                           )}

                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>ID Utilisateur:</span>
                              <span className='font-mono text-xs text-right'>{post.user.id}</span>
                           </div>

                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>Inscription:</span>
                              <span className='text-right'>{formatDate(post.user.createdAt)}</span>
                           </div>

                           {post.user.lastLoginAt && (
                              <div className='flex justify-between'>
                                 <span className='text-muted-foreground'>Dernière connexion:</span>
                                 <span className='text-right'>{formatDate(post.user.lastLoginAt)}</span>
                              </div>
                           )}

                           {post.user.company && (
                              <>
                                 <Separator />
                                 <div className='flex justify-between'>
                                    <span className='text-muted-foreground'>Entreprise:</span>
                                    <span className='font-medium text-right'>{post.user.company.name}</span>
                                 </div>
                              </>
                           )}

                           {post.user.blockedAt && (
                              <>
                                 <Separator />
                                 <div className='flex justify-between text-red-600 dark:text-red-400'>
                                    <span>Bloqué le:</span>
                                    <span className='text-right'>{formatDate(post.user.blockedAt)}</span>
                                 </div>
                              </>
                           )}
                        </div>
                     </CardContent>
                  </Card>

                  {/* Post Metadata */}
                  <Card>
                     <CardHeader>
                        <CardTitle className='text-lg'>Métadonnées</CardTitle>
                     </CardHeader>
                     <CardContent className='space-y-3 text-sm'>
                        <div className='flex justify-between'>
                           <span className='text-muted-foreground'>ID Post:</span>
                           <span className='font-mono text-xs text-right'>{post.id}</span>
                        </div>

                        <div className='flex justify-between'>
                           <span className='text-muted-foreground'>Statut:</span>
                           <span className='text-right'>{post.status}</span>
                        </div>

                        <div className='flex justify-between'>
                           <span className='text-muted-foreground'>Type:</span>
                           <Badge variant={'secondary'} className='text-xs'>
                              {getPostTypeLabel(post.type)}
                           </Badge>
                        </div>

                        <div className='flex justify-between'>
                           <span className='text-muted-foreground'>Catégorie:</span>
                           <Badge variant='outline' className='text-xs capitalize'>
                              {post.category}
                           </Badge>
                        </div>

                        <Separator />

                        <div className='flex justify-between'>
                           <span className='text-muted-foreground'>Créé:</span>
                           <span className='text-right'>{formatDate(post.createdAt)}</span>
                        </div>

                        <div className='flex justify-between'>
                           <span className='text-muted-foreground'>Modifié:</span>
                           <span className='text-right'>{formatDate(post.updatedAt)}</span>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
         <DeletePostDialog ref={deletePostModalRef} post={post} />
      </>
   )
}
