'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { POST_TYPES } from '@/lib/constants'
import { useQueryState } from 'nuqs'

const PostTypeFilter = () => {
   const [type, setType] = useQueryState('type', { defaultValue: 'all' })

   return (
      <Select value={type} onValueChange={(value) => setType(value === 'all' ? null : value)}>
         <SelectTrigger className='w-full sm:w-[150px]'>
            <SelectValue placeholder='Type' />
         </SelectTrigger>
         <SelectContent align='end'>
            <SelectItem value='all'>Tous les types</SelectItem>
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
