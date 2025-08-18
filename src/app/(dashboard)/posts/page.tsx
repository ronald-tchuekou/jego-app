import SearchInput from '@/components/base/search-input'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import { Button } from '@/components/ui/button'
import { PostsList, PostStatusFilter, PostTypeFilter } from '@/features/posts'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
   return (
      <>
         <DashboardTitle title='Annonces' description='Gérez les annonces de votre site'>
            <Button asChild>
               <Link href='/posts/create'>
                  <PlusIcon className='size-4' />
                  <span className='hidden sm:block'>Créer une annonce</span>
               </Link>
            </Button>
         </DashboardTitle>
         <div className='flex flex-col justify-between sm:flex-row gap-3'>
            <SearchInput />
            <div className='flex items-center gap-2'>
               {/* <PostCategoryFilter /> */}
               <PostTypeFilter />
               <PostStatusFilter />
            </div>
         </div>
         <PostsList />
      </>
   )
}
