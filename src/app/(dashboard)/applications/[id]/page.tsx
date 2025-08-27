import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import dynamic from 'next/dynamic'

const DynamicApplicationDetails = dynamic(() => import('@/features/applications/details/application-details'))

type Props = {
   params: Promise<{ id: string }>
}

export default async function ApplicationDetailsPage({ params }: Props) {
   const { id } = await params

   return (
      <>
         <DashboardTitle
            withBackButton
            title='Détails de la candidature'
            description='Consultez et gérez les détails de cette candidature'
         />
         <DynamicApplicationDetails applicationId={id} />
      </>
   )
}
