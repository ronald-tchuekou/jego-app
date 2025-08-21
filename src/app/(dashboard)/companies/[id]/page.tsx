import LoaderContent from '@/components/base/loader-content'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import dynamic from 'next/dynamic'

const DynamicCompanyDetails = dynamic(() => import('@/features/companies/details/company-details'), {
   loading: () => <LoaderContent />,
})

interface CompanyDetailPageProps {
   params: Promise<{
      id: string
   }>
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
   const { id } = await params

   return (
      <>
         <DashboardTitle
            title="Détails de l'entreprise"
            description="Informations détaillées de l'entreprise"
            withBackButton
         />
         <DynamicCompanyDetails companyId={id} />
      </>
   )
}
