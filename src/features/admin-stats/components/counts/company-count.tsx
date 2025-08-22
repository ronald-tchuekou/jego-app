"use client"

import CountLoader from '@/components/base/count-loader'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { IconTrendingUp } from '@tabler/icons-react'
import useGetCompanyCount from '../../hooks/use-get-company-count'

const CompanyCount = () => {
   const { data, isLoading } = useGetCompanyCount()

   if (isLoading) return <CountLoader />

   return (
      <Card className='@container/card'>
         <CardHeader>
            <CardDescription>Total Entreprises</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
               {data ?? '- - -'}
            </CardTitle>
            <CardAction>
               <Badge variant='outline'>
                  <IconTrendingUp />
                  +8.2
               </Badge>
            </CardAction>
         </CardHeader>
         <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
               Le nombre d'entreprises est en croissance <IconTrendingUp className='size-4' />
            </div>
            <div className='text-muted-foreground'>Total de toutes les entreprises</div>
         </CardFooter>
      </Card>
   )
}

export default CompanyCount
