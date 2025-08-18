'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getCategoriesAction } from '@/features/categories/actions'
import { categoryKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'

function CategoryFilter() {
   const [categoryId, setCategoryId] = useQueryState('categoryId', {
      defaultValue: 'all',
      clearOnDefault: true,
   })
   const [, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

   // Fetch categories for the filter
   const { data: categoriesData } = useQuery({
      queryKey: categoryKey.list({ page: 1, limit: 100 }),
      async queryFn() {
         const result = await getCategoriesAction({ page: 1, limit: 100 })
         if (result?.serverError) {
            throw new Error(result.serverError)
         }
         return result?.data
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
   })

   const categories = categoriesData?.data || []

   return (
      <Select
         value={categoryId}
         defaultValue={categoryId}
         onValueChange={(value) => {
            setCategoryId(value)
            setPage(1)
         }}
      >
         <SelectTrigger className='w-48 bg-card rounded-lg shadow-lg'>
            <SelectValue placeholder='Filtrer par catégorie' />
         </SelectTrigger>
         <SelectContent align='end'>
            <SelectItem value='all'>Toutes les catégories</SelectItem>
            {categories.map((category) => (
               <SelectItem key={category.id} value={category.id}>
                  {category.name}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   )
}

export default CategoryFilter
