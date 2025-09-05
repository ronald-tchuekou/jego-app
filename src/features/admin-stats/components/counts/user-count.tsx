'use client'

import CountLoader from '@/components/base/count-loader'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { IconTrendingUp } from '@tabler/icons-react'
import useGetUserCount from '../../hooks/use-get-user-count'

const UserCount = () => {
   const { data, isLoading } = useGetUserCount()

   if (isLoading) return <CountLoader />

   return (
      <Card className='@container/card'>
         <CardHeader>
            <CardDescription className='text-lg text-foreground'>Total Utilisateurs</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
               {data ?? '- - -'}
            </CardTitle>
            <CardAction>
               <Badge variant='outline'>
                  <IconTrendingUp />
                  +12.5
               </Badge>
            </CardAction>
         </CardHeader>
         <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
               Le nombre total est en croissance <IconTrendingUp className='size-4' />
            </div>
            <div className='text-muted-foreground'>Total de tous les utilisateurs</div>
         </CardFooter>
      </Card>
   )
}

export default UserCount
