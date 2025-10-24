'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import { companyKey } from '@/lib/query-kye'
import CompanyService from '@/services/company-service'
import { useQuery } from '@tanstack/react-query'
import CompanyGallery from './gallery'
import CompanyInfo from './info'
import CompanyPost from './posts'
import CompanyServices from './services'

type Props = {
   companyId: string
}

const CompanyDetails = ({ companyId }: Props) => {
   const { data, isLoading } = useQuery({
      queryKey: companyKey.detail(companyId),
      async queryFn() {
         const result = await CompanyService.getById(companyId)
         return result
      },
   })

   if (isLoading) return <LoaderContent />

   if (!data) return <EmptyContent />

   return (
      <div className='flex flex-col gap-6'>
         <CompanyInfo company={data} />
         <CompanyServices services={data.services} />
         <CompanyGallery images={data.images} />
         <CompanyPost posts={data.posts} />
      </div>
   )
}

export default CompanyDetails
