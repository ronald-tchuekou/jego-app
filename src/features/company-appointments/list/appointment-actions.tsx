'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CompanyAppointmentRequestModel } from '@/services/company-appointment-request-service'
import { Eye, MoreHorizontal, Trash } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import AlertDialogDeleteAppointment, {
    AlertDialogDeleteAppointmentRef,
} from '../components/alert-dialog-delete-appointment'

type Props = {
   appointment: CompanyAppointmentRequestModel
}

export default function AppointmentActions({ appointment }: Props) {
   const deleteDialogRef = useRef<AlertDialogDeleteAppointmentRef>(null)

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant='ghost' size='icon' className='size-8'>
                  <MoreHorizontal className='size-4' />
                  <span className='sr-only'>Ouvrir le menu</span>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
               <DropdownMenuItem asChild>
                  <Link href={`/appointments/${appointment.id}`}>
                     <Eye className='mr-2 size-4' />
                     Voir les détails
                  </Link>
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem
                  className='text-destructive'
                  onClick={() => deleteDialogRef.current?.open(appointment)}
               >
                  <Trash className='mr-2 size-4' />
                  Supprimer
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

         <AlertDialogDeleteAppointment ref={deleteDialogRef} />
      </>
   )
}
