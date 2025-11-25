'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import useGetAppointment from '../hooks/use-get-appointment'
import AppointmentActions from './appointment-actions'
import AppointmentInfo from './appointment-info'
import CompanyInfo from './company-info'
import UserInfo from './user-info'

type Props = {
   appointmentId: string
}

export default function AppointmentDetails({ appointmentId }: Props) {
   const { appointment, isLoading, error } = useGetAppointment(appointmentId)

   if (isLoading) {
      return <LoaderContent />
   }

   if (error || !appointment) {
      return (
         <EmptyContent
            text="Ce rendez-vous n'existe pas !"
            actionContent={
               <Button asChild className='mt-4'>
                  <Link href='/appointments'>Retour aux rendez-vous</Link>
               </Button>
            }
         />
      )
   }

   return (
      <div className='space-y-6'>
         <AppointmentActions appointment={appointment} />

         <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2'>
               <AppointmentInfo appointment={appointment} />
            </div>
            <div className='space-y-6'>
               <UserInfo appointment={appointment} />
               <CompanyInfo appointment={appointment} />
            </div>
         </div>
      </div>
   )
}
