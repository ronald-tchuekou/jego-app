import { compactNumber } from '@/lib/utils'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { parseAsInteger, useQueryState } from 'nuqs'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

type Props = {
   totalCount: number
   totalPages: number
   label: string
   currentLimit?: number
}

const CustomPagination = ({ totalCount, totalPages, label, currentLimit }: Props) => {
   const [limit, setLimit] = useQueryState('limit', parseAsInteger.withDefault(currentLimit || 10))
   const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

   return (
      <div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
         <p>
            {compactNumber(totalCount)} {label} au total
         </p>
         <div className='flex items-center space-x-2 lg:space-x-4'>
            <div className='flex items-center space-x-2'>
               <p className='text-sm font-medium'>Par page</p>
               <Select
                  value={`${limit}`}
                  onValueChange={(value) => {
                     setLimit(Number(value))
                     setPage(1)
                  }}
               >
                  <SelectTrigger size='sm' className='w-[70px]'>
                     <SelectValue placeholder={limit} />
                  </SelectTrigger>
                  <SelectContent side='top'>
                     {[10, 20, 30, 40, 50].map((size) => (
                        <SelectItem key={size} value={`${size}`}>
                           {size}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
            <div className='flex items-center justify-center text-sm font-medium'>
               Page {page} sur {totalPages}
            </div>
            <Button variant='outline' size='icon-sm' onClick={() => setPage(page - 1)} disabled={page === 1}>
               <ArrowLeftIcon />
            </Button>
            <Button variant='outline' size='icon-sm' onClick={() => setPage(page + 1)} disabled={page === totalPages}>
               <ArrowRightIcon />
            </Button>
         </div>
      </div>
   )
}

export default CustomPagination
