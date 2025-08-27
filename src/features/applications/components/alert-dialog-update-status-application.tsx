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
import { JobApplicationModel, JobApplicationStatus } from '@/services/job-application-service'
import { useQueryClient } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { Ref, useImperativeHandle, useState } from 'react'
import { toast } from 'sonner'
import { updateApplicationStatusAction } from '../actions'

export type AlertDialogUpdateApplicationStatusRef = {
   open: (application: JobApplicationModel, status: JobApplicationStatus) => void
}

type Props = {
   ref: Ref<AlertDialogUpdateApplicationStatusRef>
}

const AlertDialogUpdateApplicationStatus = ({ ref }: Props) => {
   const queryClient = useQueryClient()

   const [isOpen, setIsOpen] = useState(false)
   const [application, setApplication] = useState<JobApplicationModel | null>(null)
   const [status, setStatus] = useState<JobApplicationStatus | null>(null)

   const { execute: updateApplicationStatus, isPending: isUpdating } = useAction(updateApplicationStatusAction, {
      onSuccess: () => {
         toast.success(
            status === JobApplicationStatus.ACCEPTED
               ? 'Candidature acceptée avec succès'
               : status === JobApplicationStatus.REJECTED
                  ? 'Candidature rejetée avec succès'
                  : 'Candidature mise en attente avec succès'
         )
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
      setStatus(null)
   }

   useImperativeHandle(ref, () => ({
      open: (application: JobApplicationModel, status: JobApplicationStatus) => {
         setApplication(application)
         setStatus(status)
         setIsOpen(true)
      },
   }))

   return (
      <AlertDialog open={isOpen} onOpenChange={() => {}}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Attention</AlertDialogTitle>
               <AlertDialogDescription>
                  Êtes-vous sûr de vouloir{' '}
                  {status === JobApplicationStatus.ACCEPTED
                     ? 'accepter'
                     : status === JobApplicationStatus.REJECTED
                     ? 'rejeter'
                     : 'mettre en attente'}{' '}
                  la candidature de <span className='font-bold'>{application?.user.displayName}</span> pour le poste{' '}
                  <span className='font-bold'>{application?.job.title}</span> ?
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel onClick={closeModal} disabled={isUpdating}>
                  NON
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={() =>
                     updateApplicationStatus({
                        applicationId: application?.id ?? '',
                        status: status ?? JobApplicationStatus.PENDING,
                     })
                  }
                  className='relative'
               >
                  <LoaderIcon
                     className={cn('animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', {
                        'opacity-0': !isUpdating,
                     })}
                  />
                  <span className={cn({ 'opacity-0': isUpdating })}>OUI</span>
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}

export default AlertDialogUpdateApplicationStatus
