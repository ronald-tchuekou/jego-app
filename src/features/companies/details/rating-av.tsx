'use client'

import { Rating } from '@/components/ui/rating'
import { Skeleton } from '@/components/ui/skeleton'
import { companyReviewKey } from '@/lib/query-kye'
import CompanyReviewService from '@/services/company-review-service'
import { useQuery } from '@tanstack/react-query'

type Props = {
   companyId: string
}

const RatingAverage = ({ companyId }: Props) => {
   const { data: rating, isLoading } = useQuery({
      queryKey: companyReviewKey.detail(companyId),
      async queryFn() {
         const result = await CompanyReviewService.getCompanyStats(companyId)
         return result
      },
   })

   if (isLoading) return <Skeleton className='w-32 h-8' />

   return (
      <div className='flex items-center gap-2'>
         <p className='text-sm text-muted-foreground font-bold'>{rating?.totalReviews} avis</p>
         <Rating value={rating?.averageRating || 0} maxRating={5} size='sm' showValue />
      </div>
   )
}

export default RatingAverage
