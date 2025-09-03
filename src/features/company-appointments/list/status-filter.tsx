'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AppointmentStatus } from '@/services/company-appointment-request-service'
import { useQueryState } from 'nuqs'

const statusOptions = [
   { value: 'all', label: 'Tous les statuts' },
   { value: AppointmentStatus.PENDING, label: 'En attente' },
   { value: AppointmentStatus.CONFIRMED, label: 'Confirmé' },
   { value: AppointmentStatus.CANCELLED, label: 'Annulé' },
   { value: AppointmentStatus.COMPLETED, label: 'Terminé' },
]

export default function StatusFilter() {
   const [status, setStatus] = useQueryState('status')

   return (
      <Select value={status || 'all'} onValueChange={setStatus}>
         <SelectTrigger className='w-full lg:w-[200px]'>
            <SelectValue placeholder='Filtrer par statut' />
         </SelectTrigger>
         <SelectContent>
            {statusOptions.map((option) => (
               <SelectItem key={option.value} value={option.value}>
                  {option.label}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   )
}
