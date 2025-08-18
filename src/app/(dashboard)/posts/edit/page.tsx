import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import { CreatePostForm } from '@/features/posts/edit-form'

export default function Page() {
   return (
      <>
         <DashboardTitle withBackButton title='Créer une annonce' />
         <CreatePostForm />
      </>
   )
}
