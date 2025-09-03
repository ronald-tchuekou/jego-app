'use client'

import UserAvatar from '@/components/base/user-avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CompanyAppointmentRequestModel } from '@/services/company-appointment-request-service'
import { Mail, MapPin, Phone } from 'lucide-react'

type Props = {
   appointment: CompanyAppointmentRequestModel
}

export default function UserInfo({ appointment }: Props) {
   const { user } = appointment

   return (
      <Card>
         <CardHeader>
            <CardTitle className='text-base'>Informations du demandeur</CardTitle>
         </CardHeader>
         <CardContent className='space-y-4'>
            <div className='flex items-center gap-3'>
               <UserAvatar
                  user={user}
                  className='size-10'
               />
               <div>
                  <p className='font-medium'>
                     {user?.firstName} {user?.lastName}
                  </p>
                  <p className='text-sm text-muted-foreground'>{user?.role}</p>
               </div>
            </div>

            <div className='space-y-3'>
               {user?.email && (
                  <div className='flex items-center gap-2 text-sm'>
                     <Mail className='size-4 text-muted-foreground' />
                     <a href={`mailto:${user.email}`} className='hover:underline'>
                        {user.email}
                     </a>
                  </div>
               )}
               
               {user?.phone && (
                  <div className='flex items-center gap-2 text-sm'>
                     <Phone className='size-4 text-muted-foreground' />
                     <a href={`tel:${user.phone}`} className='hover:underline'>
                        {user.phone}
                     </a>
                  </div>
               )}

               {(user?.city || user?.address) && (
                  <div className='flex items-start gap-2 text-sm'>
                     <MapPin className='size-4 text-muted-foreground mt-0.5' />
                     <div>
                        {user.address && <p>{user.address}</p>}
                        {user.city && <p>{user.city}</p>}
                     </div>
                  </div>
               )}
            </div>
         </CardContent>
      </Card>
   )
}
