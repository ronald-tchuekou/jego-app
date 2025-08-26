'use client'

import CountLoader from '@/components/base/count-loader'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import useGetPostCount from '@/features/admin-stats/hooks/use-get-post-count'

const PostCount = () => {
   const { data, isLoading } = useGetPostCount()

   if (isLoading) return <CountLoader />

   return (
      <Card className='@container/card'>
         <CardHeader>
            <CardDescription className='text-lg text-foreground'>Total Publications</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
               {data ?? '- - -'}
            </CardTitle>
         </CardHeader>
         <CardFooter>
            <p className='text-muted-foreground'>Total de toutes les publications</p>
         </CardFooter>
      </Card>
   )
}

export default PostCount
