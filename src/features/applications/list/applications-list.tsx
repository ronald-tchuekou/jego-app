'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import CustomPagination from '@/components/dashboard/custom-pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { applicationKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { getApplicationsAction } from '../actions'
import ApplicationItem from './application-item'

const COLUMNS = [
   { name: 'Candidat' },
   { name: 'Poste' },
   { name: 'Statut' },
   { name: 'Date de candidature' },
   { name: 'Dernière mise à jour' },
   { name: '', width: 50 },
]

export default function ApplicationsList() {
   // Pagination and filters state
   const [status] = useQueryState('status')
   const [page] = useQueryState('page')
   const [limit] = useQueryState('limit')
   const [search] = useQueryState('q')

   // React Query for data fetching
   const {
      data: applicationsData,
      isLoading,
      error,
   } = useQuery({
      queryKey: applicationKey.list({
         page: page ? parseInt(page) : 1,
         limit: limit ? parseInt(limit) : 10,
         search: search || undefined,
         status: status || undefined,
      }),
      async queryFn({ queryKey }) {
         const filters = JSON.parse(queryKey[2].filters)
         const result = await getApplicationsAction(filters)

         if (result?.serverError) {
            throw new Error(result.serverError)
         }

         if (result?.validationErrors) {
            throw new Error(result.validationErrors._errors?.join(', ') || 'Erreur lors du chargement des candidatures')
         }

         return result?.data
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
   })

   const applications = applicationsData?.data || []
   const totalCount = applicationsData?.meta.total || 0
   const totalPages = applicationsData?.meta.lastPage || 1

   // Show error toast if query fails
   useEffect(() => {
      if (error?.message) {
         toast.error(error.message)
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
                  ) : applications.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={COLUMNS.length}>
                           <EmptyContent text='Aucune candidature disponible dans votre base de données.' />
                        </TableCell>
                     </TableRow>
                  ) : (
                     applications.map((application) => (
                        <ApplicationItem key={application.id} application={application} />
                     ))
                  )}
               </TableBody>
            </Table>
         </div>

         <CustomPagination totalCount={totalCount} totalPages={totalPages} label='candidatures' />
      </>
   )
}
