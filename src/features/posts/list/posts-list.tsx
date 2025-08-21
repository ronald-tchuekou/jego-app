'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import CustomPagination from '@/components/dashboard/custom-pagination'
import { postKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { getPostsAction } from '../actions'
import PostItem from './post-item'

function PostsList() {
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
      async queryFn({ queryKey }) {
         const filters = JSON.parse(queryKey[2].filters)
         const result = await getPostsAction(filters)

         if (result?.serverError) {
            throw new Error(result.serverError)
         }

         return result?.data
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
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
               <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 space-y-4'>
                  {posts.map((post) => (
                     <div key={post.id} className='break-inside-avoid mb-4'>
                        <PostItem post={post} />
                     </div>
                  ))}
               </div>
            )}
         </div>
         {/* Pagination */}
         {totalPages > 1 && (
            <CustomPagination totalCount={totalCount} totalPages={totalPages} label='posts' currentLimit={20} />
         )}
      </>
   )
}

export default PostsList
