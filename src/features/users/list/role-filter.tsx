'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { parseAsInteger, useQueryState } from 'nuqs'

function RoleFilter() {
   const [role, setRole] = useQueryState('role', {
      defaultValue: 'all',
      clearOnDefault: true,
   })
   const [, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

   return (
      <Select
         value={role}
         defaultValue={role}
         onValueChange={(value) => {
            setRole(value)
            setPage(1)
         }}
      >
         <SelectTrigger className='w-48 bg-card rounded-lg shadow-lg'>
            <SelectValue placeholder='Filtrer par rôle' />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value='all'>Tous les rôles</SelectItem>
            <SelectItem value='admin'>Administrateur</SelectItem>
            <SelectItem value='company:admin'>Admin Entreprise</SelectItem>
            <SelectItem value='company:agent'>Agent Entreprise</SelectItem>
            <SelectItem value='user'>Utilisateur</SelectItem>
         </SelectContent>
      </Select>
   )
}

export default RoleFilter
