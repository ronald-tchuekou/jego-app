'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import CustomPagination from '@/components/dashboard/custom-pagination'
import { useAuth } from '@/components/providers/auth'
import { postKey } from '@/lib/query-kye'
import PostService from '@/services/post-service'
import { UserRole } from '@/services/user-service'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { toast } from 'sonner'
import PostItem from './post-item'

function PostsList() {
   const { auth } = useAuth()

   // Pagination and filters state
   const [type] = useQueryState('type')
   const [status] = useQueryState('status')
   const [page] = useQueryState('page')
   const [limit] = useQueryState('limit')
   const [search] = useQueryState('q')

   // React Query for data fetching
   const {
      data: postsData,
      isLoading,
      error,
   } = useQuery({
      queryKey: postKey.list({
         page: page ? parseInt(page) : 1,
         limit: limit ? parseInt(limit) : 20,
         search: search || undefined,
         type: type || undefined,
         status: status || undefined,
      }),
      async queryFn() {
         const filters: FilterQuery & {
            category?: string
            type?: string
            status?: string
            companyId?: string
         } = {
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
         }

         if (search) filters.search = search
         if (type && type !== 'all') filters.type = type
         if (status && status !== 'all') filters.status = status

         if (
            auth?.user &&
            (auth.user.role === UserRole.COMPANY_ADMIN || auth.user.role === UserRole.COMPANY_AGENT) &&
            auth.user.companyId
         ) {
            filters.companyId = auth.user.companyId
         }

         const result = await PostService.getAll(filters)
         return result
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!auth,
   })

   const posts = postsData?.data || []
   const totalCount = postsData?.meta.total || 0
   const totalPages = postsData?.meta.lastPage || 1

   // Show error toast if query fails
   useEffect(() => {
      if (error) {
         toast.error('Erreur lors du chargement des posts')
      }
   }, [error])

   return (
      <>
         {/* Posts Grid */}
         <div className='min-h-[400px]'>
            {isLoading ? (
               <LoaderContent />
            ) : posts.length === 0 ? (
               <EmptyContent text='Aucun post trouvé' />
            ) : (
               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 space-y-4'>
                  {posts.map((post) => (
                     <div key={post.id} className='break-inside-avoid mb-4'>
                        <PostItem post={post} />
                     </div>
                  ))}
               </div>
            )}
         </div>
         {/* Pagination */}
         <CustomPagination totalCount={totalCount} totalPages={totalPages} label='posts' currentLimit={20} />
      </>
   )
}

export default PostsList
