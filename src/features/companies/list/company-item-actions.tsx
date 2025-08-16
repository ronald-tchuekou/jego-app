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
import { companyKey } from '@/lib/query-kyes'
import { cn } from '@/lib/utils'
import { CompanyModel } from '@/services/company-service'
import { useQueryClient } from '@tanstack/react-query'
import { BanIcon, CheckCircleIcon, EyeIcon, LoaderIcon, MoreVerticalIcon, Trash2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { Ref, useImperativeHandle, useRef, useState } from 'react'
import { toast } from 'sonner'
import { deleteCompanyAction, toggleBlockCompanyAction } from '../actions'

type Props = {
   company: CompanyModel
}

const CompanyActions = ({ company }: Props) => {
   const deleteDialogRef = useRef<{ open: VoidFunction }>(null)
   const blockDialogRef = useRef<{ open: VoidFunction }>(null)

   const isBlocked = !!company.blockedAt

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
                  <Link href={`/companies/${company.id}`}>
                     <EyeIcon />
                     Voir les détails
                  </Link>
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => blockDialogRef.current?.open()} className='cursor-pointer'>
                  {isBlocked ? (
                     <>
                        <CheckCircleIcon />
                        Débloquer l&apos;entreprise
                     </>
                  ) : (
                     <>
                        <BanIcon />
                        Bloquer l&apos;entreprise
                     </>
                  )}
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={() => deleteDialogRef.current?.open()}
                  className='cursor-pointer text-destructive focus:text-destructive'
                  variant='destructive'
               >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Supprimer l&apos;entreprise
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

         {/* Delete confirmation dialog */}
         <DeleteCompanyDialog ref={deleteDialogRef} company={company} />

         {/* Block/Unblock confirmation dialog */}
         <BlockCompanyDialog ref={blockDialogRef} company={company} />
      </>
   )
}

type DeleteCompanyDialogProps = {
   ref: Ref<{ open: VoidFunction }>
   company: CompanyModel
   onCompleted?: VoidFunction
}

export const DeleteCompanyDialog = ({ ref, company, onCompleted }: DeleteCompanyDialogProps) => {
   const queryClient = useQueryClient()

   const [open, setOpen] = useState(false)

   const { execute, isPending } = useAction(deleteCompanyAction, {
      onSuccess: () => {
         toast.success('Entreprise supprimée avec succès')
         setOpen(false)
         queryClient.invalidateQueries({ queryKey: companyKey.all })
         onCompleted?.()
      },
      onError: (error) => {
         toast.error(error.error.serverError)
      },
   })

   const handleDelete = async () => {
      execute({ companyId: company.id })
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
                  Êtes-vous sûr de vouloir supprimer l&apos;entreprise <strong>{company.name}</strong> ? Cette action
                  est irréversible et toutes les données associées seront perdues.
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

type BlockCompanyDialogProps = {
   ref: Ref<{ open: VoidFunction }>
   company: CompanyModel
}

export const BlockCompanyDialog = ({ ref, company }: BlockCompanyDialogProps) => {
   const queryClient = useQueryClient()
   const [open, setOpen] = useState(false)

   const { execute, isPending } = useAction(toggleBlockCompanyAction, {
      onSuccess: () => {
         toast.success('Entreprise modifiée avec succès')
         setOpen(false)
         queryClient.invalidateQueries({ queryKey: companyKey.all })
      },
      onError: (error) => {
         toast.error(error.error.serverError)
      },
   })

   useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
   }))

   const isBlocked = !!company.blockedAt

   return (
      <AlertDialog open={open} onOpenChange={() => {}}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{isBlocked ? "Débloquer l'entreprise" : "Bloquer l'entreprise"}</AlertDialogTitle>
               <AlertDialogDescription>
                  {isBlocked
                     ? `Êtes-vous sûr de vouloir débloquer l'entreprise ${company.name} ? L'entreprise pourra à nouveau être accessible.`
                     : `Êtes-vous sûr de vouloir bloquer l'entreprise ${company.name} ? L'entreprise ne sera plus accessible.`}
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel onClick={() => setOpen(false)} disabled={isPending}>
                  Annuler
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={() => execute({ companyId: company.id })}
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

export default CompanyActions
