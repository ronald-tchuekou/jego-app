import { DashboardTitle } from '@/components/dashboard/dashboard-title'

export default function EditJobPage({ params }: { params: { id: string } }) {
   return (
      <>
         <DashboardTitle title={"Modifier l'offre d'emploi"} withBackButton />
         <p>Job edit functionality coming soon...</p>
      </>
   )
}
