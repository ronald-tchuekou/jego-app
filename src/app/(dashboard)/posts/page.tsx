import SearchInput from '@/components/base/search-input'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import { Button } from '@/components/ui/button'
import { PostsList, PostTypeFilter } from '@/features/posts'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

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
               <PostTypeFilter />
            </div>
         </div>
         <PostsList />
      </>
   )
}
