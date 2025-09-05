'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { parseAsInteger, useQueryState } from 'nuqs'

function StatusFilter() {
   const [status, setStatus] = useQueryState('status', {
      defaultValue: 'all',
      clearOnDefault: true,
   })
   const [, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

   return (
      <Select
         value={status}
         defaultValue={status}
         onValueChange={(value) => {
            setStatus(value)
            setPage(1)
         }}
      >
         <SelectTrigger className='w-40 bg-card rounded-lg shadow-lg'>
            <SelectValue placeholder='Statut' />
         </SelectTrigger>
         <SelectContent align='end'>
            <SelectItem value='all'>Tous les statuts</SelectItem>
            <SelectItem value='pending'>En attente</SelectItem>
            <SelectItem value='accepted'>Acceptées</SelectItem>
            <SelectItem value='rejected'>Rejetées</SelectItem>
         </SelectContent>
      </Select>
   )
}

export default StatusFilter
