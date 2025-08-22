import LoaderContent from '@/components/base/loader-content'
import ContentGuard from '@/components/dashboard/content-guard'
import HomeDashboardTitle from '@/components/dashboard/hoem-dashboard-title'
import { UserRole } from '@/services/user-service'
import dynamic from 'next/dynamic'

const DynamicUserCount = dynamic(() => import('@/features/admin-stats/components/counts/user-count'), {
   loading: () => <LoaderContent />,
})

const DynamicCompanyCount = dynamic(() => import('@/features/admin-stats/components/counts/company-count'), {
   loading: () => <LoaderContent />,
})

const DynamicJobCount = dynamic(() => import('@/features/admin-stats/components/counts/job-count'), {
   loading: () => <LoaderContent />,
})

const DynamicPostCount = dynamic(() => import('@/features/admin-stats/components/counts/post-count'), {
   loading: () => <LoaderContent />,
})

const DynamicUserChart = dynamic(() => import('@/features/admin-stats/components/charts/user-chart'), {
   loading: () => <LoaderContent />,
})

const DynamicCompanyChart = dynamic(() => import('@/features/admin-stats/components/charts/company-chart'), {
   loading: () => <LoaderContent />,
})

const DynamicJobChart = dynamic(() => import('@/features/admin-stats/components/charts/job-chart'), {
   loading: () => <LoaderContent />,
})

const DynamicPostChart = dynamic(() => import('@/features/admin-stats/components/charts/post-chart'), {
   loading: () => <LoaderContent />,
})

export default async function Page() {
   return (
      <>
         <HomeDashboardTitle />
         <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-5 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
            <ContentGuard role={UserRole.ADMIN}>
               <DynamicUserCount />
               <DynamicCompanyCount />
               <DynamicJobCount />
               <DynamicPostCount />
            </ContentGuard>
            <ContentGuard role={UserRole.COMPANY_ADMIN}>
               <p>Company admin content</p>
            </ContentGuard>
            <ContentGuard role={UserRole.USER}>
               <p>User content</p>
            </ContentGuard>
         </div>
         <ContentGuard role={UserRole.ADMIN}>
            <DynamicUserChart />
            <DynamicCompanyChart />
            <DynamicJobChart />
            <DynamicPostChart />
         </ContentGuard>
      </>
   )
}
