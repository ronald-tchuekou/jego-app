'use client'

import ViewAsMarkdown from '@/components/base/view-as-markdown'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CompanyAppointmentRequestModel } from '@/services/company-appointment-request-service'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar, Clock } from 'lucide-react'
import AppointmentStatusLabel from '../components/appointment-status-label'

type Props = {
   appointment: CompanyAppointmentRequestModel
}

export default function AppointmentInfo({ appointment }: Props) {
   const formattedDate = format(new Date(appointment.date), 'EEEE dd MMMM yyyy', { locale: fr })
   
   return (
      <Card>
         <CardHeader>
            <div className='flex items-center justify-between'>
               <CardTitle>Détails du rendez-vous</CardTitle>
               <AppointmentStatusLabel status={appointment.status} />
            </div>
            <CardDescription>{appointment.subject}</CardDescription>
         </CardHeader>
         <CardContent className='space-y-6'>
            <div className='flex flex-col sm:flex-row gap-4'>
               <div className='flex items-center gap-2 text-sm'>
                  <Calendar className='size-4 text-muted-foreground' />
                  <span className='capitalize'>{formattedDate}</span>
               </div>
               <div className='flex items-center gap-2 text-sm'>
                  <Clock className='size-4 text-muted-foreground' />
                  <span>{appointment.time}</span>
               </div>
            </div>

            <div className='space-y-2'>
               <h4 className='text-sm font-medium'>Message</h4>
               <div className='py-4'>
                  <ViewAsMarkdown markdown={appointment.content} />
               </div>
            </div>

            <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
               <div>
                  <p className='text-sm text-muted-foreground'>Créé le</p>
                  <p className='text-sm font-medium'>
                     {format(new Date(appointment.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  </p>
               </div>
               <div>
                  <p className='text-sm text-muted-foreground'>Dernière mise à jour</p>
                  <p className='text-sm font-medium'>
                     {format(new Date(appointment.updatedAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  </p>
               </div>
            </div>
         </CardContent>
      </Card>
   )
}
