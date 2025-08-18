'use client'

import { useAuth } from '@/components/providers/auth'
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { postKey } from '@/lib/query-kye'
import { cn } from '@/lib/utils'
import { PostModel } from '@/services/post-service'
import { UserRole } from '@/services/user-service'
import { useQueryClient } from '@tanstack/react-query'
import { EditIcon, EyeIcon, LoaderIcon, MoreHorizontal, Trash2Icon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { Ref, useImperativeHandle, useRef, useState } from 'react'
import { toast } from 'sonner'
import { deletePostAction } from '../actions'

type Props = {
   post: PostModel
}

const PostItemActions = ({ post }: Props) => {
   const deletePostDialogRef = useRef<{ open: VoidFunction }>(null)

   const { auth } = useAuth()
   const queryClient = useQueryClient()

   const isAdmin = auth?.user?.role === UserRole.ADMIN
   const isAuthor = auth?.user?.id === post.userId
   const isSameCompany = !!auth?.user?.companyId && auth?.user?.companyId === post.user?.companyId
   const canEdit = isAdmin || isAuthor || isSameCompany
   const canDelete = isAdmin || isAuthor || isSameCompany
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

   if (!canEdit && !canDelete && !canChangeStatus) {
      return null
   }

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant='outline' size='icon-sm' className='size-8 dark:bg-accent bg-accent'>
                  <span className='sr-only'>Ouvrir le menu</span>
                  <MoreHorizontal className='h-4 w-4' />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='min-w-[200px]'>
               <DropdownMenuItem asChild>
                  <Link href={`/posts/${post.id}`}>
                     <EyeIcon className='' />
                     Voir
                  </Link>
               </DropdownMenuItem>

               {canEdit && (
                  <DropdownMenuItem asChild>
                     <Link href={`/posts/edit/${post.id}`}>
                        <EditIcon className='' />
                        Modifier
                     </Link>
                  </DropdownMenuItem>
               )}

               {canDelete && (
                  <>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        onClick={() => deletePostDialogRef.current?.open()}
                        disabled={isDeleting}
                        className='text-destructive focus:text-destructive'
                     >
                        <Trash2Icon className='text-destructive' />
                        Supprimer
                     </DropdownMenuItem>
                  </>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
         {/* Delete post dialog */}
         <DeletePostDialog ref={deletePostDialogRef} post={post} />
      </>
   )
}

type DeletePostDialogProps = {
   ref: Ref<{ open: VoidFunction }>
   post: PostModel
   onCompleted?: VoidFunction
}

export const DeletePostDialog = ({ ref, post, onCompleted }: DeletePostDialogProps) => {
   const queryClient = useQueryClient()

   const [open, setOpen] = useState(false)

   const { execute, isPending } = useAction(deletePostAction, {
      onSuccess: () => {
         toast.success('Post supprimé avec succès')
         setOpen(false)
         queryClient.invalidateQueries({ queryKey: postKey.all })
         onCompleted?.()
      },
      onError: (error) => {
         toast.error(error.error.serverError)
      },
   })

   const handleDelete = async () => {
      execute({ postId: post.id })
   }

   useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
   }))

   return (
      <AlertDialog open={open} onOpenChange={() => {}}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
               <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer le post <span className='font-bold'>{post.title}</span> ? Cette
                  action est irréversible et toutes les données associées seront perdues.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel onClick={() => setOpen(false)} disabled={isPending}>
                  Annuler
               </AlertDialogCancel>
               <AlertDialogAction onClick={handleDelete} disabled={isPending} className='relative'>
                  <LoaderIcon
                     className={cn('animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', {
                        'opacity-0': !isPending,
                     })}
                  />
                  <span className={cn({ 'opacity-0': isPending })}>Supprimer</span>
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}

export default PostItemActions
