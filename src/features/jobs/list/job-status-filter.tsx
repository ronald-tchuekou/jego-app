'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { JobStatus } from '@/services/job-service'
import { useQueryState } from 'nuqs'

export default function JobStatusFilter() {
   const [status, setStatus] = useQueryState('status')

   return (
      <Select value={status || 'all'} onValueChange={(value) => setStatus(value === 'all' ? null : value)}>
         <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filtrer par statut' />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value='all'>Tous les statuts</SelectItem>
            <SelectItem value={JobStatus.OPEN}>Ouvert</SelectItem>
            <SelectItem value={JobStatus.CLOSED}>Fermé</SelectItem>
         </SelectContent>
      </Select>
   )
}
