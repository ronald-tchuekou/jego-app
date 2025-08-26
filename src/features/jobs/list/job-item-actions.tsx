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
import { getEditJobPermissions } from '@/lib/permissions'
import { jobKey } from '@/lib/query-kye'
import { cn } from '@/lib/utils'
import { JobModel, JobStatus } from '@/services/job-service'
import { useQueryClient } from '@tanstack/react-query'
import { EditIcon, EyeIcon, LoaderIcon, LockIcon, MoreHorizontal, Trash2Icon, UnlockIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { Ref, useImperativeHandle, useRef, useState } from 'react'
import { toast } from 'sonner'
import { deleteJobAction, toggleJobStatusAction } from '../actions'

type Props = {
   job: JobModel
}

const JobItemActions = ({ job }: Props) => {
   const deleteJobDialogRef = useRef<{ open: VoidFunction }>(null)
   const toggleStatusDialogRef = useRef<{ open: VoidFunction }>(null)

   const { auth } = useAuth()

   const { canEdit, canDelete, canChangeStatus } = getEditJobPermissions(auth?.user, job)

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
                  <Link href={`/jobs/${job.id}`}>
                     <EyeIcon className='' />
                     Voir
                  </Link>
               </DropdownMenuItem>

               {canEdit && (
                  <DropdownMenuItem asChild>
                     <Link href={`/jobs/edit/${job.id}`}>
                        <EditIcon className='' />
                        Modifier
                     </Link>
                  </DropdownMenuItem>
               )}

               {canChangeStatus && (
                  <DropdownMenuItem onClick={() => toggleStatusDialogRef.current?.open()}>
                     {job.status === JobStatus.OPEN ? (
                        <>
                           <LockIcon className='' />
                           Fermer
                        </>
                     ) : (
                        <>
                           <UnlockIcon className='' />
                           Ouvrir
                        </>
                     )}
                  </DropdownMenuItem>
               )}

               {canDelete && (
                  <>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        onClick={() => deleteJobDialogRef.current?.open()}
                        className='text-destructive focus:text-destructive'
                     >
                        <Trash2Icon className='text-destructive' />
                        Supprimer
                     </DropdownMenuItem>
                  </>
               )}
            </DropdownMenuContent>
         </DropdownMenu>

         {/* Delete job dialog */}
         <DeleteJobDialog ref={deleteJobDialogRef} job={job} />

         {/* Toggle status dialog */}
         <ToggleJobStatusDialog ref={toggleStatusDialogRef} job={job} />
      </>
   )
}

type DeleteJobDialogProps = {
   ref: Ref<{ open: VoidFunction }>
   job: JobModel
   onCompleted?: VoidFunction
}

export const DeleteJobDialog = ({ ref, job, onCompleted }: DeleteJobDialogProps) => {
   const queryClient = useQueryClient()

   const [open, setOpen] = useState(false)

   const { execute, isPending } = useAction(deleteJobAction, {
      onSuccess: () => {
         toast.success('Job supprimé avec succès')
         setOpen(false)
         queryClient.invalidateQueries({ queryKey: jobKey.all })
         onCompleted?.()
      },
      onError: (error) => {
         toast.error(error.error.serverError)
      },
   })

   const handleDelete = async () => {
      execute({ jobId: job.id })
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
                  Êtes-vous sûr de vouloir supprimer le job <span className='font-bold'>{job.title}</span> ? Cette
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

type ToggleJobStatusDialogProps = {
   ref: Ref<{ open: VoidFunction }>
   job: JobModel
   onCompleted?: VoidFunction
}

export const ToggleJobStatusDialog = ({ ref, job, onCompleted }: ToggleJobStatusDialogProps) => {
   const queryClient = useQueryClient()

   const [open, setOpen] = useState(false)

   const { execute, isPending } = useAction(toggleJobStatusAction, {
      onSuccess: () => {
         const newStatus = job.status === JobStatus.OPEN ? 'fermé' : 'ouvert'
         toast.success(`Job ${newStatus} avec succès`)
         setOpen(false)
         queryClient.invalidateQueries({ queryKey: jobKey.all })
         onCompleted?.()
      },
      onError: (error) => {
         toast.error(error.error.serverError)
      },
   })

   const handleToggleStatus = async () => {
      execute({ jobId: job.id })
   }

   useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
   }))

   const newStatus = job.status === JobStatus.OPEN ? 'fermer' : 'ouvrir'

   return (
      <AlertDialog open={open} onOpenChange={() => {}}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Changer le statut du job</AlertDialogTitle>
               <AlertDialogDescription>
                  Êtes-vous sûr de vouloir {newStatus} le job <span className='font-bold'>{job.title}</span> ?
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel onClick={() => setOpen(false)} disabled={isPending}>
                  Annuler
               </AlertDialogCancel>
               <AlertDialogAction onClick={handleToggleStatus} disabled={isPending} className='relative'>
                  <LoaderIcon
                     className={cn('animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', {
                        'opacity-0': !isPending,
                     })}
                  />
                  <span className={cn({ 'opacity-0': isPending })}>
                     {newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
                  </span>
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}

export default JobItemActions
