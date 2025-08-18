'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQueryState } from 'nuqs'

const POST_TYPES = [
   { value: 'all', label: 'Tous les types' },
   { value: 'news', label: 'Actualité' },
   { value: 'article', label: 'Article' },
   { value: 'announcement', label: 'Annonce' },
   { value: 'event', label: 'Événement' },
   { value: 'promotion', label: 'Promotion' },
]

const PostTypeFilter = () => {
   const [type, setType] = useQueryState('type', { defaultValue: 'all' })

   return (
      <Select value={type} onValueChange={(value) => setType(value === 'all' ? null : value)}>
         <SelectTrigger className='w-full sm:w-[150px]'>
            <SelectValue placeholder='Type' />
         </SelectTrigger>
         <SelectContent align='end'>
            {POST_TYPES.map((typeOption) => (
               <SelectItem key={typeOption.value} value={typeOption.value}>
                  {typeOption.label}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   )
}

export default PostTypeFilter
