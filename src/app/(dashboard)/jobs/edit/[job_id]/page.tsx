import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import dynamic from 'next/dynamic'

const DynamicEditJobWrapper = dynamic(() => import('@/features/jobs/edit-form/edit-job-wrapper'))

export default async function EditJobPage({ params }: { params: Promise<{ job_id: string }> }) {
   const { job_id } = await params

   return (
      <>
         <DashboardTitle title={"Modifier l'offre d'emploi"} withBackButton />
         <DynamicEditJobWrapper jobId={job_id} />
      </>
   )
}
