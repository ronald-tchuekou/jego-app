import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import dynamic from 'next/dynamic'

const DynamicUserDetails = dynamic(() => import('@/features/users/details/user-details'))

interface UserDetailPageProps {
   params: Promise<{
      id: string
   }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
   const { id } = await params

   return (
      <>
         <DashboardTitle
            title="Détails de l'utilisateur"
            description='Informations détaillées du compte utilisateur'
            withBackButton
         />
         <DynamicUserDetails userId={id} />
      </>
   )
}
