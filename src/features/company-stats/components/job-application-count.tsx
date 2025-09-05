'use client'

import CountLoader from '@/components/base/count-loader'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import useGetApplicationCount from '../hooks/use-get-application-count'

const JobApplicationCount = () => {
   const { data, isLoading } = useGetApplicationCount()

   if (isLoading) return <CountLoader />

   return (
      <Card className='@container/card'>
         <CardHeader>
            <CardDescription className='text-lg text-foreground'>Total Candidatures</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
               {data ?? '- - -'}
            </CardTitle>
         </CardHeader>
         <CardFooter>
            <p className='text-muted-foreground'>Total de toutes les candidatures</p>
         </CardFooter>
      </Card>
   )
}

export default JobApplicationCount
