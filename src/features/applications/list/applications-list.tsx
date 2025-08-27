'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import CustomPagination from '@/components/dashboard/custom-pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useGetJobApplications from '../hooks/use-get-job-applications'
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
   const { data, isLoading } = useGetJobApplications()

   const applications = data?.data || []
   const totalCount = data?.meta.total || 0
   const totalPages = data?.meta.lastPage || 1

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
