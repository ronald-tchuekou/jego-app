'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import { Button } from '@/components/ui/button'
import { applicationKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getApplicationByIdAction } from '../actions'
import PostInfo from './post-info'
import UserInfo from './user-info'

type Props = {
   applicationId: string
}

export default function ApplicationDetails({ applicationId }: Props) {
   const {
      data: application,
      isLoading,
      error,
   } = useQuery({
      queryKey: applicationKey.detail(applicationId),
      async queryFn({ queryKey }) {
         const applicationId = queryKey[2]
         const result = await getApplicationByIdAction({ applicationId })

         if (result?.serverError) {
            throw new Error(result.serverError)
         }

         if (result?.validationErrors) {
            throw new Error(
               result.validationErrors._errors?.join(', ') || 'Erreur lors du chargement de la candidature'
            )
         }

         return result?.data
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
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
