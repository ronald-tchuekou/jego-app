'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import CustomPagination from '@/components/dashboard/custom-pagination'
import { useAuth } from '@/components/providers/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { userKey } from '@/lib/query-kye'
import UserService, { UserRole } from '@/services/user-service'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { toast } from 'sonner'
import UserItem from './user-item'

const COLUMNS = [
   { name: 'Utilisateur' },
   { name: 'Rôle' },
   { name: 'Entreprise' },
   { name: 'Vérification' },
   { name: 'Statut' },
   { name: 'Dernière connexion' },
   { name: 'Date de création' },
   { name: '', width: 50 },
]

export default function UsersList() {
   const { auth } = useAuth()

   // Pagination and filters state
   const [role] = useQueryState('role')
   const [page] = useQueryState('page')
   const [limit] = useQueryState('limit')
   const [search] = useQueryState('q')
   const [status] = useQueryState('status')

   // React Query for data fetching
   const {
      data: usersData,
      isLoading,
      error,
   } = useQuery({
      queryKey: userKey.list({
         page: page ? parseInt(page) : undefined,
         limit: limit ? parseInt(limit) : undefined,
         search: search || undefined,
         role: role || undefined,
         status: status ? (status === 'active' ? 'active' : 'blocked') : undefined,
      }),
      async queryFn() {
         if (!auth?.token) {
            throw new Error('Not authenticated')
         }

         const filters: FilterQuery & {
            role?: UserRole
            status?: 'active' | 'blocked'
         } = {
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
         }

         if (search) filters.search = search
         if (role && role !== 'all') filters.role = role as UserRole
         if (status && status !== 'all') {
            filters.status = status === 'blocked' ? 'blocked' : 'active'
         }

         const result = await UserService.getUsers(filters, auth.token)
         return result
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!auth?.token,
   })

   const users = usersData?.data || []
   const totalCount = usersData?.meta.total || 0
   const totalPages = usersData?.meta.lastPage || 1

   // Show error toast if query fails
   useEffect(() => {
      if (error) {
         toast.error('Erreur lors du chargement des utilisateurs')
      }
   }, [error])

   return (
      <>
         <div className='bg-card border rounded-lg shadow-lg'>
            <Table>
               <TableHeader>
                  <TableRow>
                     {COLUMNS.map((column) => (
                        <TableHead key={column.name} style={{ width: column.width }}>
                           {column.name}
                        </TableHead>
                     ))}
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {isLoading ? (
                     <TableRow>
                        <TableCell colSpan={COLUMNS.length}>
                           <LoaderContent />
                        </TableCell>
                     </TableRow>
                  ) : users.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={COLUMNS.length}>
                           <EmptyContent text='Aucun utilisateur disponible dans votre base de données.' />
                        </TableCell>
                     </TableRow>
                  ) : (
                     users.map((user) => <UserItem key={user.id} user={user} />)
                  )}
               </TableBody>
            </Table>
         </div>

         <CustomPagination totalCount={totalCount} totalPages={totalPages} label='utilisateurs' />
      </>
   )
}
