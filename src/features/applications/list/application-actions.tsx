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
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { applicationKey } from '@/lib/query-kye'
import { JobApplicationModel, JobApplicationStatus } from '@/services/job-application-service'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Eye, FileText, LoaderIcon, MoreHorizontal, Trash2, XCircle } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { deleteApplicationAction, updateApplicationStatusAction } from '../actions'

type Props = {
   application: JobApplicationModel
}

const ApplicationActions = ({ application }: Props) => {
   const router = useRouter()
   const queryClient = useQueryClient()
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

   // Mutation for updating application status
   const { execute: updateStatus, isPending: isUpdatingStatus } = useAction(updateApplicationStatusAction, {
      onSuccess: () => {
         toast.success('Statut de la candidature mis à jour avec succès')
         queryClient.invalidateQueries({ queryKey: applicationKey.all })
      },
      onError: (error) => {
         toast.error(error.error.serverError)
      },
   })

   // Mutation for deleting application
   const { execute: deleteApplication, isPending: isDeleting } = useAction(deleteApplicationAction, {
      onSuccess: () => {
         toast.success('Candidature supprimée avec succès')
         queryClient.invalidateQueries({ queryKey: applicationKey.all })
         setIsDeleteDialogOpen(false)
      },
      onError: (error) => {
         toast.error(error.error.serverError)
      },
   })

   const handleViewResume = () => {
      if (application.resumePath) {
         window.open(application.resumePath, '_blank')
      } else {
         toast.error('Aucun CV disponible pour cette candidature')
      }
   }

   const handleViewDetails = () => {
      router.push(`/applications/${application.id}`)
   }

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant='ghost' className='h-8 w-8 p-0' disabled={isUpdatingStatus || isDeleting}>
                  <span className='sr-only'>Ouvrir le menu</span>
                  {isUpdatingStatus || isDeleting ? (
                     <LoaderIcon className='h-4 w-4 animate-spin' />
                  ) : (
                     <MoreHorizontal className='h-4 w-4' />
                  )}
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
               <DropdownMenuLabel>Actions</DropdownMenuLabel>
               <DropdownMenuSeparator />

               <DropdownMenuItem onClick={handleViewDetails}>
                  <Eye className='mr-2 h-4 w-4' />
                  Voir les détails
               </DropdownMenuItem>

               {application.resumePath && (
                  <DropdownMenuItem onClick={handleViewResume}>
                     <FileText className='mr-2 h-4 w-4' />
                     Voir le CV
                  </DropdownMenuItem>
               )}

               <DropdownMenuSeparator />

               {application.status !== JobApplicationStatus.ACCEPTED && (
                  <DropdownMenuItem
                     onClick={() =>
                        updateStatus({ applicationId: application.id, status: JobApplicationStatus.ACCEPTED })
                     }
                  >
                     <CheckCircle className='mr-2 h-4 w-4 text-green-600' />
                     Accepter
                  </DropdownMenuItem>
               )}

               {application.status !== JobApplicationStatus.REJECTED && (
                  <DropdownMenuItem
                     onClick={() =>
                        updateStatus({ applicationId: application.id, status: JobApplicationStatus.REJECTED })
                     }
                  >
                     <XCircle className='mr-2 h-4 w-4 text-red-600' />
                     Rejeter
                  </DropdownMenuItem>
               )}

               {application.status !== JobApplicationStatus.PENDING && (
                  <DropdownMenuItem
                     onClick={() =>
                        updateStatus({ applicationId: application.id, status: JobApplicationStatus.PENDING })
                     }
                  >
                     <Eye className='mr-2 h-4 w-4 text-yellow-600' />
                     Mettre en attente
                  </DropdownMenuItem>
               )}

               <DropdownMenuSeparator />

               <DropdownMenuItem
                  className='text-red-600 hover:text-red-700'
                  onClick={() => setIsDeleteDialogOpen(true)}
               >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Supprimer
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

         <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette candidature ?</AlertDialogTitle>
                  <AlertDialogDescription>
                     Cette action est irréversible. La candidature sera définitivement supprimée de la base de données.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={() => deleteApplication({ applicationId: application.id })}
                     className='bg-red-600 hover:bg-red-700'
                  >
                     Supprimer
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   )
}

export default ApplicationActions
