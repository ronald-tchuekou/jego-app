import SearchInput from '@/components/base/search-input'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import CompanyStatusFilter from '@/features/companies/list/company-status-filter'
import dynamic from 'next/dynamic'

const DynamicCompaniesList = dynamic(() => import('@/features/companies/list/companies-list'))
const DynamicCategoryFilter = dynamic(() => import('@/features/companies/list/category-filter'))

export default function CompaniesPage() {
   return (
      <>
         <DashboardTitle title='Gestion des entreprises' description='Gérez les entreprises de votre plateforme'>
            <div className='flex items-center gap-2'>
               <SearchInput />
               <DynamicCategoryFilter />
               <CompanyStatusFilter />
            </div>
         </DashboardTitle>
         <DynamicCompaniesList />
      </>
   )
}
