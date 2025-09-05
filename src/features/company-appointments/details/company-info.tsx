'use client'

import { useAuth } from '@/components/providers/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEFAULT_COMPANY_IMAGE } from '@/lib/constants'
import env from '@/lib/env/client'
import { CompanyAppointmentRequestModel } from '@/services/company-appointment-request-service'
import { UserRole } from '@/services/user-service'
import { Globe, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

type Props = {
   appointment: CompanyAppointmentRequestModel
}

export default function CompanyInfo({ appointment }: Props) {
   const { company } = appointment
   const { auth } = useAuth()
   const isAdmin = auth?.user?.role === UserRole.ADMIN

   const initials = appointment.company?.name.charAt(0).toUpperCase()
   const companyLogo = appointment.company?.logo
      ? `${env.NEXT_PUBLIC_API_URL}/v1/${appointment.company?.logo}`
      : DEFAULT_COMPANY_IMAGE

   if (!isAdmin) return null

   return (
      <Card>
         <CardHeader>
            <CardTitle className='text-base'>Informations de l&apos;entreprise</CardTitle>
         </CardHeader>
         <CardContent className='space-y-4'>
            <div className='flex items-center gap-3'>
               <div className='size-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center'>
                  <Avatar className='size-10'>
                     <AvatarImage src={companyLogo} alt={appointment.company?.name} />
                     <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
                  </Avatar>
               </div>
               <div>
                  <p className='font-medium'>{company?.name}</p>
                  {company?.email && <p className='text-sm text-muted-foreground'>{company.email}</p>}
               </div>
            </div>

            <div className='space-y-3'>
               {company?.website && (
                  <div className='flex items-center gap-2 text-sm'>
                     <Globe className='size-4 text-muted-foreground' />
                     <a href={company.website} target='_blank' rel='noopener noreferrer' className='hover:underline'>
                        {company.website}
                     </a>
                  </div>
               )}

               {company?.phone && (
                  <div className='flex items-center gap-2 text-sm'>
                     <Phone className='size-4 text-muted-foreground' />
                     <a href={`tel:${company.phone}`} className='hover:underline'>
                        {company.phone}
                     </a>
                  </div>
               )}

               {(company?.city || company?.address) && (
                  <div className='flex items-start gap-2 text-sm'>
                     <MapPin className='size-4 text-muted-foreground mt-0.5' />
                     <div>
                        {company.address && <p>{company.address}</p>}
                        {company.city && <p>{company.city}</p>}
                     </div>
                  </div>
               )}
            </div>

            <div className='pt-3 border-t'>
               <Link href={`/companies/${company?.id}`} className='text-sm text-primary hover:underline'>
                  Voir le profil de l&apos;entreprise →
               </Link>
            </div>
         </CardContent>
      </Card>
   )
}
