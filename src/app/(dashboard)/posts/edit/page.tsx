import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import dynamic from 'next/dynamic'

const DynamicCreatePostForm = dynamic(() => import('@/features/posts/edit-form/create-post-form'))

export default function Page() {
   return (
      <>
         <DashboardTitle withBackButton title='Créer une annonce' />
         <DynamicCreatePostForm />
      </>
   )
}
