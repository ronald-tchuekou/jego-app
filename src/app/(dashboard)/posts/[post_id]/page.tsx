import LoaderContent from '@/components/base/loader-content'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import dynamic from 'next/dynamic'

const DynamicPostDetails = dynamic(() => import('@/features/posts/details/post-details'), {
   loading: () => <LoaderContent />,
})

export default async function Page({ params }: { params: Promise<{ post_id: string }> }) {
   const { post_id } = await params

   return (
      <>
         <DashboardTitle withBackButton title={`Détails de l'annonce`} />
         <DynamicPostDetails postId={post_id} />
      </>
   )
}
