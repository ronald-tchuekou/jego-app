'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import { applicationKey } from '@/lib/query-kye'
import JobApplicationService from '@/services/job-application-service'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import PostInfo from './post-info'
import UserInfo from './user-info'

type Props = {
   applicationId: string
}

export default function ApplicationDetails({ applicationId }: Props) {
   const { auth } = useAuth()

   const {
      data: application,
      isLoading,
      error,
   } = useQuery({
      queryKey: applicationKey.detail(applicationId),
      async queryFn() {
         if (!auth?.token) {
            throw new Error('Not authenticated')
         }

         const result = await JobApplicationService.getById(applicationId, auth.token)
         return result
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!auth?.token,
   })

   if (isLoading) {
      return <LoaderContent />
   }

   if (error || !application) {
      return (
         <EmptyContent
            text="Cette candidature n'existe pas !"
            actionContent={
               <Button asChild className='mt-4'>
                  <Link href='/applications'>Retour aux candidatures</Link>
               </Button>
            }
         />
      )
   }

   return (
      <div className='flex flex-col lg:flex-row gap-6'>
         <div className='flex-1'>
            <UserInfo application={application} />
         </div>
         <div className='flex-1'>
            <PostInfo application={application} />
         </div>
      </div>
   )
}
