'use client'

import CountLoader from '@/components/base/count-loader'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import useGetJobCount from '@/features/admin-stats/hooks/use-get-job-count'

const JobCount = () => {
   const { data, isLoading } = useGetJobCount()

   if (isLoading) return <CountLoader />

   return (
      <Card className='@container/card'>
         <CardHeader>
            <CardDescription className='text-lg text-foreground'>Total Offres d&apos;Emploi</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
               {data ?? '- - -'}
            </CardTitle>
         </CardHeader>
         <CardFooter>
            <p className='text-muted-foreground'>Total de toutes les offres d&apos;emploi</p>
         </CardFooter>
      </Card>
   )
}

export default JobCount
