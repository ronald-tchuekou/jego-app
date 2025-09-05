import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import StatusFilter from '@/features/company-appointments/list/status-filter'
import dynamic from 'next/dynamic'

const DynamicAppointmentsList = dynamic(() => import('@/features/company-appointments/list/appointments-list'))

export default function AppointmentsPage() {
   return (
      <>
         {/* Title */}
         <DashboardTitle title={'Gestion des rendez-vous'} description='Gérez et consultez tous les rendez-vous'>
            <div className='flex items-center gap-2'>
               <StatusFilter />
            </div>
         </DashboardTitle>
         {/* List */}
         <DynamicAppointmentsList />
      </>
   )
}
