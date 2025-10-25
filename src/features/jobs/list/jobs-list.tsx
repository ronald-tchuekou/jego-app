'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import CustomPagination from '@/components/dashboard/custom-pagination'
import { useAuth } from '@/components/providers/auth'
import { jobKey } from '@/lib/query-kye'
import JobService, { JobStatus } from '@/services/job-service'
import { UserRole } from '@/services/user-service'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { toast } from 'sonner'
import JobItem from './job-item'

function JobsList() {
   const { auth } = useAuth()

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
      async queryFn() {
         const filters: FilterQuery & {
            status?: JobStatus
            companyName?: string
            companyId?: string
         } = {
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
         }

         if (search) filters.search = search
         if (status && status !== 'all') filters.status = status as JobStatus
         if (companyName && companyName !== 'all') filters.companyName = companyName

         if (
            auth?.user &&
            (auth.user.role === UserRole.COMPANY_ADMIN || auth.user.role === UserRole.COMPANY_AGENT) &&
            auth.user.companyId
         ) {
            filters.companyId = auth.user.companyId
         }

         const result = await JobService.getAll(filters)
         return result
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!auth,
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
               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                  {jobs.map((job) => (
                     <JobItem key={job.id} job={job} />
                  ))}
               </div>
            )}
         </div>
         <CustomPagination totalCount={totalCount} totalPages={totalPages} label='jobs' currentLimit={20} />
      </>
   )
}

export default JobsList
