import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import dynamic from 'next/dynamic'

const DynamicJobDetails = dynamic(() => import('@/features/jobs/details/job-details'))

type Props = {
   params: {
      id: string
   }
}

export default function JobDetailPage({ params }: Props) {
   return (
      <>
         <DashboardTitle withBackButton title={`Détails de l'offre d'emploi`} />
         <DynamicJobDetails jobId={params.id} />
      </>
   )
}
