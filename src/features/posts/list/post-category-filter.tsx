'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CategoryModel } from '@/services/category-service'
import { useQueryState } from 'nuqs'

const PostCategoryFilter = () => {
   const [category, setCategory] = useQueryState('category', { defaultValue: 'all' })

   const categories = [] as CategoryModel[]

   return (
      <Select value={category} onValueChange={(value) => setCategory(value === 'all' ? null : value)}>
         <SelectTrigger className='w-full'>
            <SelectValue placeholder='Catégorie' />
         </SelectTrigger>
         <SelectContent align='end'>
            <SelectItem value='all'>Toutes les catégories</SelectItem>
            {categories.map((cat) => (
               <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   )
}

export default PostCategoryFilter
