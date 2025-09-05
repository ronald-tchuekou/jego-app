import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import dynamic from 'next/dynamic'

const DynamicCreateJobForm = dynamic(() => import('@/features/jobs/edit-form/create-job-form'))

export default function CreateJobPage() {
   return (
      <>
         <DashboardTitle title={"Créer une offre d'emploi"} withBackButton />
         <DynamicCreateJobForm />
      </>
   )
}
