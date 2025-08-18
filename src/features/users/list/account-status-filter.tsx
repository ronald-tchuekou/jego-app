'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { parseAsInteger, useQueryState } from 'nuqs'

function AccountStatusFilter() {
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
         <SelectTrigger className='w-32 bg-card rounded-lg shadow-lg'>
            <SelectValue placeholder='Statut' />
         </SelectTrigger>
         <SelectContent align='end'>
            <SelectItem value='all'>Tous</SelectItem>
            <SelectItem value='active'>Actifs</SelectItem>
            <SelectItem value='blocked'>Bloqués</SelectItem>
         </SelectContent>
      </Select>
   )
}

export default AccountStatusFilter
