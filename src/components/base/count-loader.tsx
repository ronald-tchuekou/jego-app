import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function CountLoader() {
   return (
      <Card className='@container/card'>
         <CardHeader>
            <CardDescription>
               <Skeleton className='h-4 w-full' />
            </CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
               <Skeleton className='h-10 w-1/2' />
            </CardTitle>
            <CardAction>
               <Skeleton className='h-5 w-10' />
            </CardAction>
         </CardHeader>
         <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-3 w-full' />
         </CardFooter>
      </Card>
   )
}
