import ContentGuard from '@/components/dashboard/content-guard'
import HomeDashboardTitle from '@/components/dashboard/hoem-dashboard-title'
import { UserRole } from '@/services/user-service'
import dynamic from 'next/dynamic'

const DynamicUserCount = dynamic(() => import('@/features/admin-stats/components/counts/user-count'))
const DynamicCompanyCount = dynamic(() => import('@/features/admin-stats/components/counts/company-count'))
const DynamicJobCount = dynamic(() => import('@/features/admin-stats/components/counts/job-count'))
const DynamicPostCount = dynamic(() => import('@/features/admin-stats/components/counts/post-count'))
const DynamicUserChart = dynamic(() => import('@/features/admin-stats/components/charts/user-chart'))
const DynamicCompanyChart = dynamic(() => import('@/features/admin-stats/components/charts/company-chart'))
const DynamicJobChart = dynamic(() => import('@/features/admin-stats/components/charts/job-chart'))
const DynamicPostChart = dynamic(() => import('@/features/admin-stats/components/charts/post-chart'))

// For company admin
const DynamicCompanyAppointmentCount = dynamic(() => import('@/features/company-stats/components/appointment-count'))
const DynamicCompanyJobApplicationCount = dynamic(() => import('@/features/company-stats/components/job-application-count'))
const DynamicCompanyJobCount = dynamic(() => import('@/features/company-stats/components/job-count'))
const DynamicCompanyPostCount = dynamic(() => import('@/features/company-stats/components/post-count'))
const DynamicApplicationsList = dynamic(() => import('@/features/applications/list/applications-list'))
const DynamicAppointmentsList = dynamic(() => import('@/features/company-appointments/list/appointments-list'))

export default async function Page() {
   return (
      <>
         <HomeDashboardTitle />
         <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-5 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
            <ContentGuard roles={[UserRole.ADMIN]}>
               <DynamicUserCount />
               <DynamicCompanyCount />
               <DynamicJobCount />
               <DynamicPostCount />
            </ContentGuard>
            <ContentGuard roles={[UserRole.COMPANY_ADMIN, UserRole.COMPANY_AGENT]}>
               <DynamicCompanyAppointmentCount />
               <DynamicCompanyJobApplicationCount />
               <DynamicCompanyJobCount />
               <DynamicCompanyPostCount />
            </ContentGuard>
            <ContentGuard roles={[UserRole.USER]}>
               <p>User content</p>
            </ContentGuard>
         </div>
         <ContentGuard roles={[UserRole.ADMIN]}>
            <DynamicUserChart />
            <DynamicCompanyChart />
            <DynamicJobChart />
            <DynamicPostChart />
         </ContentGuard>
         <ContentGuard roles={[UserRole.COMPANY_ADMIN, UserRole.COMPANY_AGENT]}>
            <div className='space-y-2 text-lg font-medium'>
               <h2>Candidatures récentes</h2>
               <DynamicApplicationsList justRecent />
            </div>
            <div className='space-y-2 text-lg font-medium'>
               <h2>Rendez-vous récents</h2>
               <DynamicAppointmentsList justRecent />
            </div>
         </ContentGuard>
         <ContentGuard roles={[UserRole.USER]}>
            <p>User content</p>
         </ContentGuard>
      </>
   )
}
