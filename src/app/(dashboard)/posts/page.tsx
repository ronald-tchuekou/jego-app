import LoaderContent from '@/components/base/loader-content'
import SearchInput from '@/components/base/search-input'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const DynamicPostTypeFilter = dynamic(() => import('@/features/posts/list/post-type-filter'), {
   loading: () => <LoaderContent />,
})

const DynamicPostsList = dynamic(() => import('@/features/posts/list/posts-list'), {
   loading: () => <LoaderContent />,
})

export default function Page() {
   return (
      <>
         <DashboardTitle title='Annonces' description='Gérez les annonces de votre site'>
            <Button asChild>
               <Link href='/posts/edit'>
                  <PlusIcon className='size-4' />
                  <span className='hidden sm:block'>Créer une annonce</span>
               </Link>
            </Button>
         </DashboardTitle>
         <div className='flex justify-between gap-3'>
            <SearchInput />
            <div className='flex items-center gap-2'>
               <DynamicPostTypeFilter />
            </div>
         </div>
         <DynamicPostsList />
      </>
   )
}
