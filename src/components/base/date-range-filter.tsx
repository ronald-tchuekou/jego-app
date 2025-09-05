'use client'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon, X } from 'lucide-react'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useState } from 'react'

function DateRangeFilter() {
   const [startDate, setStartDate] = useQueryState('startDate')
   const [endDate, setEndDate] = useQueryState('endDate')
   const [, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
   
   const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
      from: startDate ? new Date(startDate) : undefined,
      to: endDate ? new Date(endDate) : undefined,
   })

   const handleDateRangeSelect = (range?: { from?: Date; to?: Date }) => {
      setDateRange(range || {})
      
      if (range?.from && range?.to) {
         setStartDate(format(range.from, 'yyyy-MM-dd'))
         setEndDate(format(range.to, 'yyyy-MM-dd'))
         setPage(1)
      }
   }

   const handleClearDates = () => {
      setDateRange({})
      setStartDate(null)
      setEndDate(null)
      setPage(1)
   }

   return (
      <div className='flex items-center gap-2'>
         <Popover>
            <PopoverTrigger asChild>
               <Button
                  variant='outline'
                  className={cn(
                     'w-[280px] justify-start text-left font-normal bg-card shadow-lg',
                     !dateRange.from && 'text-muted-foreground'
                  )}
               >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {dateRange.from ? (
                     dateRange.to ? (
                        <>
                           {format(dateRange.from, 'dd MMM yyyy', { locale: fr })} -{' '}
                           {format(dateRange.to, 'dd MMM yyyy', { locale: fr })}
                        </>
                     ) : (
                        format(dateRange.from, 'dd MMM yyyy', { locale: fr })
                     )
                  ) : (
                     <span>Période</span>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='end'>
               <Calendar
                  initialFocus
                  mode='range'
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={handleDateRangeSelect}
                  numberOfMonths={2}
                  locale={fr}
               />
            </PopoverContent>
         </Popover>
         
         {(dateRange.from || dateRange.to) && (
            <Button
               variant='ghost'
               size='icon'
               className='h-10 w-10'
               onClick={handleClearDates}
            >
               <X className='h-4 w-4' />
               <span className='sr-only'>Effacer les dates</span>
            </Button>
         )}
      </div>
   )
}

export default DateRangeFilter
