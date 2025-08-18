"use client"

import { Rating } from '@/components/ui/rating'
import { Skeleton } from '@/components/ui/skeleton'
import { companyReviewKey } from '@/lib/query-kye'
import { useQuery } from '@tanstack/react-query'
import { getCompanyStatsAction } from '../actions'

type Props = {
   companyId: string
}

const RatingAverage = ({ companyId }: Props) => {
   const { data: rating, isLoading } = useQuery({
      queryKey: companyReviewKey.detail(companyId),
      async queryFn({ queryKey }) {
         const companyId = queryKey[2]
         const { data } = await getCompanyStatsAction({ companyId })
         return data
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

export default RatingAverage;
