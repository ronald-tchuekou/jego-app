import SearchInput from '@/components/base/search-input'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import CategoryFilter from '@/features/companies/list/category-filter'
import { CompaniesList } from '@/features/companies/list/companies-list'
import CompanyStatusFilter from '@/features/companies/list/company-status-filter'

export default function CompaniesPage() {
   return (
      <>
         <DashboardTitle title='Gestion des entreprises' description='Gérez les entreprises de votre plateforme'>
            <div className='flex items-center gap-2'>
               <SearchInput />
               <CategoryFilter />
               <CompanyStatusFilter />
            </div>
         </DashboardTitle>
         <CompaniesList />
      </>
   )
}
