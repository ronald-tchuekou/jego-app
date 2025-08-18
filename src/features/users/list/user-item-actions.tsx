'use client'

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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { userKey } from '@/lib/query-kye'
import { cn } from '@/lib/utils'
import { UserModel } from '@/services/user-service'
import { useQueryClient } from '@tanstack/react-query'
import { BanIcon, CheckCircleIcon, EyeIcon, LoaderIcon, MoreVerticalIcon, Trash2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { Ref, useImperativeHandle, useRef, useState } from 'react'
import { toast } from 'sonner'
import { deleteUserAction, toggleBlockUserAction } from '../actions'

type Props = {
   user: UserModel
}

const UserActions = ({ user }: Props) => {
   const deleteDialogRef = useRef<{ open: VoidFunction }>(null)
   const blockDialogRef = useRef<{ open: VoidFunction }>(null)

   const isBlocked = user.blockedAt !== null

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant='ghost' size={'icon-sm'}>
                  <span className='sr-only'>Ouvrir le menu</span>
                  <MoreVerticalIcon />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
               <DropdownMenuItem className='cursor-pointer' asChild>
                  <Link href={`/users/${user.id}`}>
                     <EyeIcon />
                     Voir les détails
                  </Link>
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => blockDialogRef.current?.open()} className='cursor-pointer'>
                  {isBlocked ? (
                     <>
                        <CheckCircleIcon />
                        Débloquer le compte
                     </>
                  ) : (
                     <>
                        <BanIcon />
                        Bloquer le compte
                     </>
                  )}
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={() => deleteDialogRef.current?.open()}
                  className='cursor-pointer text-destructive focus:text-destructive'
                  variant='destructive'
               >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Supprimer le compte
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

         {/* Delete confirmation dialog */}
         <DeleteUserDialog ref={deleteDialogRef} user={user} />

         {/* Block/Unblock confirmation dialog */}
         <BlockUserDialog ref={blockDialogRef} user={user} />
      </>
   )
}

type DeleteUserDialogProps = {
   ref: Ref<{ open: VoidFunction }>
   user: UserModel
   onCompleted?: VoidFunction
}

export const DeleteUserDialog = ({ ref, user, onCompleted }: DeleteUserDialogProps) => {
   const queryClient = useQueryClient()

   const [open, setOpen] = useState(false)

   const { execute, isPending } = useAction(deleteUserAction, {
      onSuccess: () => {
         toast.success('Compte supprimé avec succès')
         setOpen(false)
         queryClient.invalidateQueries({ queryKey: userKey.all })
         onCompleted?.()
      },
      onError: (error) => {
         toast.error(error.error.serverError)
      },
   })

   const handleDelete = async () => {
      execute({ userId: user.id })
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
                  Êtes-vous sûr de vouloir supprimer le compte de <strong>{user.displayName}</strong> ? Cette action est
                  irréversible et toutes les données associées seront perdues.
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

type BlockUserDialogProps = {
   ref: Ref<{ open: VoidFunction }>
   user: UserModel
}

export const BlockUserDialog = ({ ref, user }: BlockUserDialogProps) => {
   const queryClient = useQueryClient()
   const [open, setOpen] = useState(false)

   const { execute, isPending } = useAction(toggleBlockUserAction, {
      onSuccess: () => {
         toast.success('Compte modifié avec succès')
         setOpen(false)
         queryClient.invalidateQueries({ queryKey: userKey.all })
      },
      onError: (error) => {
         toast.error(error.error.serverError)
      },
   })

   useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
   }))

   const isBlocked = user.blockedAt !== null

   return (
      <AlertDialog open={open} onOpenChange={() => {}}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{isBlocked ? 'Débloquer le compte' : 'Bloquer le compte'}</AlertDialogTitle>
               <AlertDialogDescription>
                  {isBlocked
                     ? `Êtes-vous sûr de vouloir débloquer le compte de ${user.displayName} ? L'utilisateur pourra à nouveau accéder à son compte.`
                     : `Êtes-vous sûr de vouloir bloquer le compte de ${user.displayName} ? L'utilisateur ne pourra plus accéder à son compte.`}
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel onClick={() => setOpen(false)} disabled={isPending}>
                  Annuler
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={() => execute({ userId: user.id })}
                  disabled={isPending}
                  className='relative'
               >
                  <LoaderIcon
                     className={cn('animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', {
                        'opacity-0': !isPending,
                     })}
                  />
                  <span className={cn({ 'opacity-0': isPending })}>{isBlocked ? 'Débloquer' : 'Bloquer'}</span>
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}

export default UserActions
