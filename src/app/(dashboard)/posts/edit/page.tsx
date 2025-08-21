import LoaderContent from '@/components/base/loader-content'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import dynamic from 'next/dynamic'

const DynamicCreatePostForm = dynamic(() => import('@/features/posts/edit-form/create-post-form'), {
   loading: () => <LoaderContent />,
})

export default function Page() {
   return (
      <>
         <DashboardTitle withBackButton title='Créer une annonce' />
         <DynamicCreatePostForm />
      </>
   )
}
