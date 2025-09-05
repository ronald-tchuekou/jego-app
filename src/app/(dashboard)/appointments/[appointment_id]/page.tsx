import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import dynamic from 'next/dynamic'

const DynamicAppointmentDetails = dynamic(() => import('@/features/company-appointments/details/appointment-details'))

type Props = {
   params: Promise<{ appointment_id: string }>
}

export default async function AppointmentDetailsPage({ params }: Props) {
   const { appointment_id } = await params

   return (
      <>
         <DashboardTitle
            withBackButton
            title='Détails du rendez-vous'
            description='Consultez et gérez les détails de ce rendez-vous'
         />
         <DynamicAppointmentDetails appointmentId={appointment_id} />
      </>
   )
}
