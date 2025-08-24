import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import dynamic from 'next/dynamic'

const DynamicJobDetails = dynamic(() => import('@/features/jobs/details/job-details'))

type Props = {
   params: Promise<{
      job_id: string
   }>
}

export default async function JobDetailPage({ params }: Props) {
   const { job_id } = await params

   return (
      <>
         <DashboardTitle withBackButton title={`Détails de l'offre d'emploi`} />
         <DynamicJobDetails jobId={job_id} />
      </>
   )
}
