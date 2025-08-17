'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQueryState } from 'nuqs'

const POST_STATUSES = [
   { value: 'all', label: 'Tous les statuts' },
   { value: 'published', label: 'Publié' },
   { value: 'draft', label: 'Brouillon' },
   { value: 'archived', label: 'Archivé' },
]

const PostStatusFilter = () => {
   const [status, setStatus] = useQueryState('status', { defaultValue: 'all' })

   return (
      <Select value={status} onValueChange={(value) => setStatus(value === 'all' ? null : value)}>
         <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Statut" />
         </SelectTrigger>
         <SelectContent>
            {POST_STATUSES.map((statusOption) => (
               <SelectItem key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   )
}

export default PostStatusFilter
