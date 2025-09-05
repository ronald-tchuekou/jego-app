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
import { applicationKey } from '@/lib/query-kye'
import { cn } from '@/lib/utils'
import { JobApplicationModel } from '@/services/job-application-service'
import { useQueryClient } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { Ref, useImperativeHandle, useState } from 'react'
import { toast } from 'sonner'
import { deleteApplicationAction } from '../actions'

export type AlertDialogDeleteApplicationRef = {
   open: (application: JobApplicationModel) => void
}

type Props = {
   ref: Ref<AlertDialogDeleteApplicationRef>
}

const AlertDialogDeleteApplication = ({ ref }: Props) => {
   const queryClient = useQueryClient()

   const [isOpen, setIsOpen] = useState(false)
   const [application, setApplication] = useState<JobApplicationModel | null>(null)

   const { execute: deleteApplication, isPending: isDeleting } = useAction(deleteApplicationAction, {
      onSuccess: () => {
         toast.success('Candidature supprimée avec succès')
         queryClient.invalidateQueries({ queryKey: applicationKey.all })
         closeModal()
      },
      onError: (error) => {
         toast.error(error.error.serverError)
      },
   })

   const closeModal = () => {
      setIsOpen(false)
      setApplication(null)
   }

   useImperativeHandle(ref, () => ({
      open: (application: JobApplicationModel) => {
         setApplication(application)
         setIsOpen(true)
      },
   }))

   return (
      <AlertDialog open={isOpen} onOpenChange={() => {}}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette candidature ?</AlertDialogTitle>
               <AlertDialogDescription>
                  Cette action est irréversible. La candidature sera définitivement supprimée de la base de données.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel onClick={closeModal} disabled={isDeleting}>
                  Annuler
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={() => deleteApplication({ applicationId: application?.id ?? '' })}
                  className='relative'
               >
                  <LoaderIcon
                     className={cn('animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', {
                        'opacity-0': !isDeleting,
                     })}
                  />
                  <span className={cn({ 'opacity-0': isDeleting })}>Supprimer</span>
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}

export default AlertDialogDeleteApplication
