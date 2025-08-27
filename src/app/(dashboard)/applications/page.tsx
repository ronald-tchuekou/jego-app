import SearchInput from '@/components/base/search-input'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import ExportButton from '@/features/applications/components/export-button'
import StatusFilter from '@/features/applications/list/status-filter'
import dynamic from 'next/dynamic'

const DynamicApplicationsList = dynamic(() => import('@/features/applications/list/applications-list'))

export default function ApplicationsPage() {
   return (
      <>
         {/* Title */}
         <DashboardTitle title={'Gestion des candidatures'} description='Gérez et consultez toutes les candidatures'>
            <div className='flex items-center gap-2'>
               <SearchInput />
               <StatusFilter />
               <ExportButton />
            </div>
         </DashboardTitle>
         {/* List */}
         <DynamicApplicationsList />
      </>
   )
}
