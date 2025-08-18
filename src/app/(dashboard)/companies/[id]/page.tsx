import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import CompanyDetails from '@/features/companies/details/company-details'

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
         <CompanyDetails companyId={id} />
      </>
   )
}
