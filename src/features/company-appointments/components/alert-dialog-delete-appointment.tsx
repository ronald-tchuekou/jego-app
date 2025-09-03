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
import { CompanyAppointmentRequestModel } from '@/services/company-appointment-request-service'
import { useQueryClient } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { Ref, useImperativeHandle, useState } from 'react'
import { toast } from 'sonner'
import { deleteAppointmentAction } from '../actions'

export type AlertDialogDeleteAppointmentRef = {
   open: (appointment: CompanyAppointmentRequestModel) => void
}

type Props = {
   ref: Ref<AlertDialogDeleteAppointmentRef>
}

const AlertDialogDeleteAppointment = ({ ref }: Props) => {
   const queryClient = useQueryClient()

   const [isOpen, setIsOpen] = useState(false)
   const [appointment, setAppointment] = useState<CompanyAppointmentRequestModel | null>(null)

   const { execute: deleteAppointment, isPending: isDeleting } = useAction(deleteAppointmentAction, {
      onSuccess: () => {
         toast.success('Rendez-vous supprimé avec succès')
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
      open: (appointment: CompanyAppointmentRequestModel) => {
         setAppointment(appointment)
         setIsOpen(true)
      },
   }))

   return (
      <AlertDialog open={isOpen} onOpenChange={() => {}}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce rendez-vous ?</AlertDialogTitle>
               <AlertDialogDescription>
                  Cette action est irréversible. Le rendez-vous sera définitivement supprimé de la base de données.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel onClick={closeModal} disabled={isDeleting}>
                  Annuler
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={() => deleteAppointment({ appointmentId: appointment?.id ?? '' })}
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

export default AlertDialogDeleteAppointment
