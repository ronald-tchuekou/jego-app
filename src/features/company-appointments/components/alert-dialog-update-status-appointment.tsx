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
import { companyAppointmentRequestKey } from '@/lib/query-kye'
import { cn } from '@/lib/utils'
import { AppointmentStatus, CompanyAppointmentRequestModel } from '@/services/company-appointment-request-service'
import { useQueryClient } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { Ref, useImperativeHandle, useState } from 'react'
import { toast } from 'sonner'
import { updateAppointmentStatusAction } from '../actions'

export type AlertDialogUpdateStatusAppointmentRef = {
   open: (appointment: CompanyAppointmentRequestModel, status: AppointmentStatus) => void
}

type Props = {
   ref: Ref<AlertDialogUpdateStatusAppointmentRef>
}

const statusMessages = {
   [AppointmentStatus.CONFIRMED]: {
      title: 'Confirmer le rendez-vous',
      description: 'Êtes-vous sûr de vouloir confirmer ce rendez-vous ?',
      success: 'Rendez-vous confirmé avec succès',
   },
   [AppointmentStatus.CANCELLED]: {
      title: 'Annuler le rendez-vous',
      description: 'Êtes-vous sûr de vouloir annuler ce rendez-vous ?',
      success: 'Rendez-vous annulé avec succès',
   },
   [AppointmentStatus.COMPLETED]: {
      title: 'Marquer comme terminé',
      description: 'Êtes-vous sûr de vouloir marquer ce rendez-vous comme terminé ?',
      success: 'Rendez-vous marqué comme terminé',
   },
   [AppointmentStatus.PENDING]: {
      title: 'Remettre en attente',
      description: 'Êtes-vous sûr de vouloir remettre ce rendez-vous en attente ?',
      success: 'Rendez-vous remis en attente',
   },
}

const AlertDialogUpdateStatusAppointment = ({ ref }: Props) => {
   const queryClient = useQueryClient()

   const [isOpen, setIsOpen] = useState(false)
   const [appointment, setAppointment] = useState<CompanyAppointmentRequestModel | null>(null)
   const [newStatus, setNewStatus] = useState<AppointmentStatus>(AppointmentStatus.PENDING)

   const messages = statusMessages[newStatus] || statusMessages[AppointmentStatus.PENDING]

   const { execute: updateStatus, isPending: isUpdating } = useAction(updateAppointmentStatusAction, {
      onSuccess: () => {
         toast.success(messages.success)
         queryClient.invalidateQueries({ queryKey: companyAppointmentRequestKey.all })
         closeModal()
      },
      onError: (error) => {
         toast.error(error.error.serverError)
      },
   })

   const closeModal = () => {
      setIsOpen(false)
      setAppointment(null)
   }

   useImperativeHandle(ref, () => ({
      open: (appointment: CompanyAppointmentRequestModel, status: AppointmentStatus) => {
         setAppointment(appointment)
         setNewStatus(status)
         setIsOpen(true)
      },
   }))

   return (
      <AlertDialog open={isOpen} onOpenChange={() => {}}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{messages.title}</AlertDialogTitle>
               <AlertDialogDescription>{messages.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel onClick={closeModal} disabled={isUpdating}>
                  Annuler
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={() => updateStatus({ appointmentId: appointment?.id ?? '', status: newStatus })}
                  className='relative'
               >
                  <LoaderIcon
                     className={cn('animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', {
                        'opacity-0': !isUpdating,
                     })}
                  />
                  <span className={cn({ 'opacity-0': isUpdating })}>Confirmer</span>
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}

export default AlertDialogUpdateStatusAppointment
