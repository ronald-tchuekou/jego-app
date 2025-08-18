import { DashboardTitle } from '@/components/dashboard/dashboard-title'

export default async function Page({ params }: { params: Promise<{ post_id: string }> }) {
   const { post_id } = await params

   return (
      <>
         <DashboardTitle withBackButton title={`Détails de l'annonce ${post_id}`} />
      </>
   )
}
