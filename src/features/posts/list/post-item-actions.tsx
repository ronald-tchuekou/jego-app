'use client'

import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuSub,
   DropdownMenuSubContent,
   DropdownMenuSubTrigger,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { postKey } from '@/lib/query-kies'
import { PostModel } from '@/services/post-service'
import { UserRole } from '@/services/user-service'
import { useQueryClient } from '@tanstack/react-query'
import { Archive, Edit, Eye, MoreHorizontal, Trash, Users } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { deletePostAction, updatePostStatusAction } from '../actions'

type Props = {
   post: PostModel
}

const PostItemActions = ({ post }: Props) => {
   const { auth } = useAuth()
   const queryClient = useQueryClient()

   const isAdmin = auth?.user?.role === UserRole.ADMIN
   const isAuthor = auth?.user?.id === post.userId
   const canEdit = isAdmin || isAuthor
   const canDelete = isAdmin || isAuthor
   const canChangeStatus = isAdmin

   // Delete post action
   const { execute: executeDelete, isExecuting: isDeleting } = useAction(deletePostAction, {
      onSuccess: () => {
         toast.success('Post supprimé avec succès')
         queryClient.invalidateQueries({ queryKey: postKey.all })
      },
      onError: ({ error }) => {
         toast.error(error.serverError || 'Erreur lors de la suppression du post')
      },
   })

   // Update status action
   const { execute: executeUpdateStatus, isExecuting: isUpdatingStatus } = useAction(updatePostStatusAction, {
      onSuccess: () => {
         toast.success('Statut du post modifié avec succès')
         queryClient.invalidateQueries({ queryKey: postKey.all })
      },
      onError: ({ error }) => {
         toast.error(error.serverError || 'Erreur lors de la modification du statut')
      },
   })

   const handleDelete = () => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
         executeDelete({ postId: post.id })
      }
   }

   const handleStatusUpdate = (status: 'draft' | 'published' | 'archived') => {
      executeUpdateStatus({ postId: post.id, status })
   }

   if (!canEdit && !canDelete && !canChangeStatus) {
      return null
   }

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon-sm' className='size-8 dark:bg-accent bg-accent'>
               <span className='sr-only'>Ouvrir le menu</span>
               <MoreHorizontal className='h-4 w-4' />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align='end' className='w-[200px]'>
            <DropdownMenuItem>
               <Eye className='mr-2 h-4 w-4' />
               Voir
            </DropdownMenuItem>

            {canEdit && (
               <DropdownMenuItem>
                  <Edit className='mr-2 h-4 w-4' />
                  Modifier
               </DropdownMenuItem>
            )}

            {canChangeStatus && (
               <>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                     <DropdownMenuSubTrigger>
                        <Users className='mr-2 h-4 w-4' />
                        Changer le statut
                     </DropdownMenuSubTrigger>
                     <DropdownMenuSubContent>
                        <DropdownMenuItem
                           onClick={() => handleStatusUpdate('published')}
                           disabled={isUpdatingStatus || post.status === 'published'}
                        >
                           Publier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           onClick={() => handleStatusUpdate('draft')}
                           disabled={isUpdatingStatus || post.status === 'draft'}
                        >
                           Mettre en brouillon
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           onClick={() => handleStatusUpdate('archived')}
                           disabled={isUpdatingStatus || post.status === 'archived'}
                        >
                           <Archive className='mr-2 h-4 w-4' />
                           Archiver
                        </DropdownMenuItem>
                     </DropdownMenuSubContent>
                  </DropdownMenuSub>
               </>
            )}

            {canDelete && (
               <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                     onClick={handleDelete}
                     disabled={isDeleting}
                     className='text-destructive focus:text-destructive'
                  >
                     <Trash className='mr-2 h-4 w-4' />
                     Supprimer
                  </DropdownMenuItem>
               </>
            )}
         </DropdownMenuContent>
      </DropdownMenu>
   )
}

export default PostItemActions
