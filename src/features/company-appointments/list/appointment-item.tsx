'use client'

import UserAvatar from '@/components/base/user-avatar'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { CompanyAppointmentRequestModel } from '@/services/company-appointment-request-service'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Image from 'next/image'
import AppointmentStatusLabel from '../components/appointment-status-label'
import AppointmentActions from './appointment-actions'

type Props = {
   appointment: CompanyAppointmentRequestModel
   isAdmin: boolean
}

export default function AppointmentItem({ appointment, isAdmin }: Props) {
   const formattedDate = format(new Date(appointment.date), 'dd MMM yyyy', { locale: fr })
   const formattedCreatedAt = format(new Date(appointment.createdAt), 'dd MMM yyyy', { locale: fr })

   return (
      <TableRow className={cn(!appointment.isRead && 'bg-muted/30')}>
         <TableCell>
            <div className='flex items-center gap-3'>
               <UserAvatar user={appointment.user} className='size-10' />
               <div>
                  <p className='font-medium text-sm'>
                     {appointment.user?.firstName} {appointment.user?.lastName}
                  </p>
                  <p className='text-xs text-muted-foreground'>{appointment.user?.email}</p>
               </div>
            </div>
         </TableCell>

         {isAdmin && (
            <TableCell>
               <div className='flex items-center gap-3'>
                  <div className='size-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center'>
                     {appointment.company?.logo ? (
                        <Image
                           src={appointment.company.logo}
                           alt={appointment.company.name}
                           className='size-full object-cover'
                           width={48}
                           height={48}
                        />
                     ) : (
                        <span className='text-xs font-medium'>
                           {appointment.company?.name?.charAt(0).toUpperCase()}
                        </span>
                     )}
                  </div>
                  <div>
                     <p className='font-medium text-sm'>{appointment.company?.name}</p>
                     <p className='text-xs text-muted-foreground'>{appointment.company?.city}</p>
                  </div>
               </div>
            </TableCell>
         )}

         <TableCell>
            <div>
               <p className='font-medium text-sm'>{formattedDate}</p>
               <p className='text-xs text-muted-foreground'>{appointment.time}</p>
            </div>
         </TableCell>

         <TableCell>
            <p className='text-sm max-w-[200px] truncate'>{appointment.subject}</p>
         </TableCell>

         <TableCell>
            <AppointmentStatusLabel status={appointment.status} />
         </TableCell>

         <TableCell>
            <p className='text-sm text-muted-foreground'>{formattedCreatedAt}</p>
         </TableCell>

         <TableCell>
            <AppointmentActions appointment={appointment} />
         </TableCell>
      </TableRow>
   )
}
