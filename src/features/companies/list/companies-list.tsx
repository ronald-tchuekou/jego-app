'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import CustomPagination from '@/components/dashboard/custom-pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { companyKey } from '@/lib/query-kies'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { getCompaniesAction } from '../actions'
import CompanyItem from './company-item'

const COLUMNS = [
   { name: 'Entreprise' },
   { name: 'Téléphone' },
   { name: 'Ville' },
   { name: 'Catégorie' },
   { name: 'Vérification' },
   { name: 'Statut' },
   { name: 'Date de création' },
   { name: '', width: 50 },
]

export function CompaniesList() {
   // Pagination and filters state
   const [categoryId] = useQueryState('categoryId')
   const [page] = useQueryState('page')
   const [limit] = useQueryState('limit')
   const [search] = useQueryState('q')
   const [status] = useQueryState('status')

   // React Query for data fetching
   const {
      data: companiesData,
      isLoading,
      error,
   } = useQuery({
      queryKey: companyKey.list({
         page: page ? parseInt(page) : undefined,
         limit: limit ? parseInt(limit) : undefined,
         search: search || undefined,
         categoryId: categoryId || undefined,
         status: status ? (status === 'active' ? 'active' : 'blocked') : undefined,
      }),
      async queryFn({ queryKey }) {
         const filters = JSON.parse(queryKey[2].filters)
         const result = await getCompaniesAction(filters)

         if (result?.serverError) {
            throw new Error(result.serverError)
         }

         return result?.data
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
   })

   const companies = companiesData?.data || []
   const totalCount = companiesData?.meta.total || 0
   const totalPages = companiesData?.meta.lastPage || 1

   // Show error toast if query fails
   useEffect(() => {
      if (error) {
         toast.error('Erreur lors du chargement des entreprises')
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
                  ) : companies.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={COLUMNS.length}>
                           <EmptyContent text='Aucune entreprise disponible dans votre base de données.' />
                        </TableCell>
                     </TableRow>
                  ) : (
                     companies.map((company) => <CompanyItem key={company.id} company={company} />)
                  )}
               </TableBody>
            </Table>
         </div>

         <CustomPagination totalCount={totalCount} totalPages={totalPages} label='entreprises' />
      </>
   )
}
