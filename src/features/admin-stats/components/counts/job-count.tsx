'use client'

import CountLoader from '@/components/base/count-loader'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { IconTrendingUp } from '@tabler/icons-react'
import useGetJobCount from '../../hooks/use-get-job-count'

const JobCount = () => {
   const { data, isLoading } = useGetJobCount()

   if (isLoading) return <CountLoader />

   return (
      <Card className='@container/card'>
         <CardHeader>
            <CardDescription>Total Offres d&apos;Emploi</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
               {data ?? '- - -'}
            </CardTitle>
            <CardAction>
               <Badge variant='outline'>
                  <IconTrendingUp />
                  +6.7
               </Badge>
            </CardAction>
         </CardHeader>
         <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
               Le nombre d&apos;offres d&apos;emploi est en croissance <IconTrendingUp className='size-4' />
            </div>
            <div className='text-muted-foreground'>Total de toutes les offres d&apos;emploi</div>
         </CardFooter>
      </Card>
   )
}

export default JobCount
