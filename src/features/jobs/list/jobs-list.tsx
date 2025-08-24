'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import CustomPagination from '@/components/dashboard/custom-pagination'
import { jobKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { getJobsAction } from '../actions'
import JobItem from './job-item'

function JobsList() {
   // Pagination and filters state
   const [status] = useQueryState('status')
   const [page] = useQueryState('page')
   const [limit] = useQueryState('limit')
   const [search] = useQueryState('q')
   const [companyName] = useQueryState('company')

   // React Query for data fetching
   const {
      data: jobsData,
      isLoading,
      error,
   } = useQuery({
      queryKey: jobKey.list({
         page: page ? parseInt(page) : 1,
         limit: limit ? parseInt(limit) : 20,
         search: search || undefined,
         status: status || undefined,
         companyName: companyName || undefined,
      }),
      async queryFn({ queryKey }) {
         const filters = JSON.parse(queryKey[2].filters)
         const result = await getJobsAction(filters)

         if (result?.serverError) {
            throw new Error(result.serverError)
         }

         return result?.data
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
   })

   const jobs = jobsData?.data || []
   const totalCount = jobsData?.meta.total || 0
   const totalPages = jobsData?.meta.lastPage || 1

   // Show error toast if query fails
   useEffect(() => {
      if (error) {
         toast.error('Erreur lors du chargement des jobs')
      }
   }, [error])

   return (
      <>
         {/* Jobs Grid */}
         <div className='min-h-[400px]'>
            {isLoading ? (
               <LoaderContent />
            ) : jobs.length === 0 ? (
               <EmptyContent text='Aucun job trouvé' />
            ) : (
               <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 space-y-4'>
                  {jobs.map((job) => (
                     <div key={job.id} className='break-inside-avoid mb-4'>
                        <JobItem job={job} />
                     </div>
                  ))}
               </div>
            )}
         </div>
         {/* Pagination */}
         {totalPages > 1 && (
            <CustomPagination totalCount={totalCount} totalPages={totalPages} label='jobs' currentLimit={20} />
         )}
      </>
   )
}

export default JobsList
