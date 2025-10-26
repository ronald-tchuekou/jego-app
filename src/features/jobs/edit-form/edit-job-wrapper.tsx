'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import { jobKey } from '@/lib/query-kye'
import JobService from '@/services/job-service'
import { useQuery } from '@tanstack/react-query'
import CreateJobForm from './create-job-form'

type Props = {
   jobId: string
}

function EditJobWrapper({ jobId }: Props) {
   const { data, isLoading } = useQuery({
      queryKey: jobKey.detail(jobId),
      async queryFn() {
         const result = await JobService.getById(jobId)
         return result
      },
   })

   if (isLoading) return <LoaderContent />

   if (!data) return <EmptyContent text="Le job que vous recherchez n'existe pas." />

   return <CreateJobForm job={data} />
}

export default EditJobWrapper
