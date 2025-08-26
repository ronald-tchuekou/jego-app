'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import { useAuth } from '@/components/providers/auth'
import { getEditJobPermissions } from '@/lib/permissions'
import { jobKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { getJobByIdAction } from '../actions'
import { JobDetailsAdmin } from './job-details-admin'
import { JobDetailsUser } from './job-details-user'

type Props = {
   jobId: string
}

export default function JobDetails({ jobId }: Props) {
   const { auth } = useAuth()

   const { data, isLoading } = useQuery({
      queryKey: jobKey.detail(jobId),
      async queryFn({ queryKey }) {
         const jobId = queryKey[2]
         const result = await getJobByIdAction({ jobId })
         if (result.serverError) throw new Error(result.serverError)
         return result.data
      },
   })

   if (isLoading) return <LoaderContent />

   if (!data) return <EmptyContent text="Le job que vous recherchez n'existe pas ou a été supprimé." />

   const { canEdit, canDelete, canChangeStatus } = getEditJobPermissions(auth?.user, data)

   // Check if user is admin or author
   const isAdmin = canEdit || canDelete || canChangeStatus

   return isAdmin ? <JobDetailsAdmin job={data} /> : <JobDetailsUser job={data} />
}
