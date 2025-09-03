'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CompanyAppointmentRequestModel } from '@/services/company-appointment-request-service'
import { Building2, Globe, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

type Props = {
   appointment: CompanyAppointmentRequestModel
}

export default function CompanyInfo({ appointment }: Props) {
   const { company } = appointment

   return (
      <Card>
         <CardHeader>
            <CardTitle className='text-base'>Informations de l'entreprise</CardTitle>
         </CardHeader>
         <CardContent className='space-y-4'>
            <div className='flex items-center gap-3'>
               <div className='size-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center'>
                  {company?.logo ? (
                     <img 
                        src={company.logo} 
                        alt={company.name} 
                        className='size-full object-cover'
                     />
                  ) : (
                     <Building2 className='size-6 text-muted-foreground' />
                  )}
               </div>
               <div>
                  <p className='font-medium'>{company?.name}</p>
                  {company?.email && (
                     <p className='text-sm text-muted-foreground'>{company.email}</p>
                  )}
               </div>
            </div>

            <div className='space-y-3'>
               {company?.website && (
                  <div className='flex items-center gap-2 text-sm'>
                     <Globe className='size-4 text-muted-foreground' />
                     <a 
                        href={company.website} 
                        target='_blank' 
                        rel='noopener noreferrer'
                        className='hover:underline'
                     >
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
               <Link 
                  href={`/companies/${company?.id}`}
                  className='text-sm text-primary hover:underline'
               >
                  Voir le profil de l'entreprise →
               </Link>
            </div>
         </CardContent>
      </Card>
   )
}
