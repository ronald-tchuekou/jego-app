import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import dynamic from 'next/dynamic'

const DynamicEditPostWrapper = dynamic(() => import('@/features/posts/edit-form/edit-post-wrapper'))

export default async function Page({ params }: { params: Promise<{ post_id: string }> }) {
   const { post_id } = await params

   return (
      <>
         <DashboardTitle withBackButton title='Modifier une annonce' />
         <DynamicEditPostWrapper postId={post_id} />
      </>
   )
}
