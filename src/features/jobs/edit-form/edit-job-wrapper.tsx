"use client"

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import { jobKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { getJobByIdAction } from '../actions'
import CreateJobForm from './create-job-form'

type Props = {
   jobId: string
}

function EditJobWrapper({ jobId }: Props) {
   const { data, isLoading } = useQuery({
      queryKey: jobKey.detail(jobId),
      async queryFn({ queryKey }) {
         const id = queryKey[2]
         const result = await getJobByIdAction({ jobId: id })
         if (result.serverError) throw new Error(result.serverError)
         return result.data
      },
   })

   if (isLoading) return <LoaderContent />

   if (!data) return <EmptyContent text="Le job que vous recherchez n'existe pas." />
   
   return <CreateJobForm job={data} />
}

export default EditJobWrapper
