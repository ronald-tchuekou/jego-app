import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import EditPostWrapper from '@/features/posts/edit-form/edit-post-wrapper'

export default async function Page({ params }: { params: Promise<{ post_id: string }> }) {
   const { post_id } = await params

   return (
      <>
         <DashboardTitle withBackButton title='Modifier une annonce' />
         <EditPostWrapper postId={post_id} />
      </>
   )
}
