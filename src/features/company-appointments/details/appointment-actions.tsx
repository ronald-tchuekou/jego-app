'use client'

import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import { AppointmentStatus, CompanyAppointmentRequestModel } from '@/services/company-appointment-request-service'
import { UserRole } from '@/services/user-service'
import { Calendar, Check, Trash2, X } from 'lucide-react'
import { useRef } from 'react'
import AlertDialogDeleteAppointment, {
   AlertDialogDeleteAppointmentRef,
} from '../components/alert-dialog-delete-appointment'
import AlertDialogUpdateStatusAppointment, {
   AlertDialogUpdateStatusAppointmentRef,
} from '../components/alert-dialog-update-status-appointment'

type Props = {
   appointment: CompanyAppointmentRequestModel
}

export default function AppointmentActions({ appointment }: Props) {
   const { auth } = useAuth()
   const user = auth?.user
   const deleteDialogRef = useRef<AlertDialogDeleteAppointmentRef>(null)
   const updateStatusDialogRef = useRef<AlertDialogUpdateStatusAppointmentRef>(null)

   const canManageAppointment = user?.role === UserRole.COMPANY_ADMIN || user?.role === UserRole.COMPANY_AGENT

   if (!canManageAppointment) return null

   return (
      <>
         <div className='flex items-center gap-2 justify-end'>
            {appointment.status === AppointmentStatus.PENDING && (
               <>
                  <Button
                     variant='outline'
                     size='sm'
                     onClick={() => updateStatusDialogRef.current?.open(appointment, AppointmentStatus.CONFIRMED)}
                  >
                     <Check className='size-4 mr-2' />
                     Confirmer
                  </Button>
                  <Button
                     variant='outline'
                     size='sm'
                     onClick={() => updateStatusDialogRef.current?.open(appointment, AppointmentStatus.CANCELLED)}
                  >
                     <X className='size-4 mr-2' />
                     Annuler
                  </Button>
               </>
            )}

            {appointment.status === AppointmentStatus.CONFIRMED && (
               <Button
                  variant='outline'
                  size='sm'
                  onClick={() => updateStatusDialogRef.current?.open(appointment, AppointmentStatus.COMPLETED)}
               >
                  <Calendar className='size-4 mr-2' />
                  Marquer comme terminé
               </Button>
            )}

            <Button
               variant='outline'
               size='sm'
               className='text-destructive'
               onClick={() => deleteDialogRef.current?.open(appointment)}
            >
               <Trash2 className='size-4 mr-2' />
               Supprimer
            </Button>
         </div>

         <AlertDialogDeleteAppointment ref={deleteDialogRef} />
         <AlertDialogUpdateStatusAppointment ref={updateStatusDialogRef} />
      </>
   )
}
