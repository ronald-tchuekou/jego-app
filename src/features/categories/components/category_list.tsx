'use client'

import CustomPagination from '@/components/dashboard/custom-pagination'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { categoryKey } from '@/lib/query-kyes'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { AwardIcon, EditIcon, PlusIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useRef } from 'react'
import { getCategoriesAction } from '../actions'
import DeleteCategoryButton from './delete-category-button'
import EditCategoryModal, { EditCategoryModalRef } from './edit-category-modal/idnex'

const CategoryList = () => {
   const editCategoryModalRef = useRef<EditCategoryModalRef>(null)

   const [search] = useQueryState('q')
   const [page] = useQueryState('page')
   const [limit] = useQueryState('limit')

   const { isLoading, data: categoriesData } = useQuery({
      queryKey: categoryKey.list({
         search: search || undefined,
         page: Number.parseInt(page || '1'),
         limit: Number.parseInt(limit || '10'),
      }),
      async queryFn({ queryKey }) {
         const filters = JSON.parse(queryKey[2].filters)

         const response = await getCategoriesAction(filters)

         if (response.serverError) {
            throw new Error(response.serverError)
         }

         return response.data
      },
   })

   const categories = categoriesData?.data || []
   const totalCount = categoriesData?.meta.total || 0
   const totalPages = categoriesData?.meta.lastPage || 1

   if (isLoading)
      return (
         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4 gap-4'>
            {Array(4)
               .fill(0)
               .map((_, i) => (
                  <div key={`option-${i}`} className='flex-1 bg-card rounded-md border p-4'>
                     <div className='flex items-center space-x-2 mb-3'>
                        <Skeleton className='size-5 flex-none' />
                        <Skeleton className={'h-7 w-full'} />
                     </div>
                     <div className={'space-y-2'}>
                        <Skeleton className={'w-full h-4'} />
                        <Skeleton className={'w-full h-4'} />
                     </div>
                  </div>
               ))}
         </div>
      )

   return (
      <>
         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4 gap-4'>
            {categories.map((category) => (
               <div key={category.id} className='flex-1 bg-card border rounded-md p-4 relative'>
                  <div className='flex items-center space-x-2'>
                     <AwardIcon className='size-5 text-primary' />
                     <Label className='font-medium line-clamp-1'>{category.name}</Label>
                  </div>
                  <p className='text-sm text-muted-foreground line-clamp-2 mt-1'>{category.description}</p>
                  <div className={'absolute top-1 right-1 bg-card flex'}>
                     <Button
                        variant={'ghost'}
                        size={'icon-sm'}
                        onClick={() => editCategoryModalRef.current?.open(category)}
                     >
                        <EditIcon />
                     </Button>
                     <DeleteCategoryButton id={category.id} />
                  </div>
               </div>
            ))}

            {/* Add button */}
            <button
               onClick={() => editCategoryModalRef.current?.open()}
               className={cn(
                  'rounded-md border border-primary/40 border-dashed p-5 flex items-center justify-center gap-2',
                  'hover:bg-primary/10 transition-all hover:shadow-lg',
               )}
            >
               <PlusIcon className='size-6 text-primary' />
               <span className='text-base text-primary font-medium'>Ajouter une catégorie</span>
            </button>
         </div>
         <CustomPagination totalCount={totalCount} totalPages={totalPages} label='catégories' />
         <EditCategoryModal ref={editCategoryModalRef} />
      </>
   )
}

export default CategoryList
