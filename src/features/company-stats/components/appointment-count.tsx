'use client'

import CountLoader from '@/components/base/count-loader'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import useGetAppointmentCount from '../hooks/use-get-appointment-count'

const AppointmentCount = () => {
   const { data, isLoading } = useGetAppointmentCount()

   if (isLoading) return <CountLoader />

   return (
      <Card className='@container/card'>
         <CardHeader>
            <CardDescription className='text-lg text-foreground'>Total Rendez-vous</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
               {data ?? '- - -'}
            </CardTitle>
         </CardHeader>
         <CardFooter>
            <p className='text-muted-foreground'>Total de tous les rendez-vous</p>
         </CardFooter>
      </Card>
   )
}

export default AppointmentCount
