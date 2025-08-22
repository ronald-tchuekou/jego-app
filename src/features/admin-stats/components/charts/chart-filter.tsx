"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useIsMobile } from '@/hooks/use-mobile'
import { CHART_PERIODS } from '@/lib/constants'
import { useQueryState } from 'nuqs'
import React from 'react'

export default function ChartFilter() {
   const isMobile = useIsMobile()

   const [timeRange, setTimeRange] = useQueryState('timeRange', {
      defaultValue: CHART_PERIODS[0].value,
      clearOnDefault: true,
   })

   React.useEffect(() => {
      if (isMobile) {
         setTimeRange('7d')
      }
   }, [isMobile, setTimeRange])

   return (
      <>
         <ToggleGroup
            type='single'
            value={timeRange}
            onValueChange={setTimeRange}
            variant='outline'
            className='hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex'
         >
            {CHART_PERIODS.map((period) => (
               <ToggleGroupItem key={period.value} value={period.value}>
                  {period.label}
               </ToggleGroupItem>
            ))}
         </ToggleGroup>
         <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
               className='flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden'
               size='sm'
               aria-label='Select a value'
            >
               <SelectValue placeholder={CHART_PERIODS[0].label} />
            </SelectTrigger>
            <SelectContent className='rounded-xl'>
               {CHART_PERIODS.map((period) => (
                  <SelectItem key={period.value} value={period.value} className='rounded-lg'>
                     {period.label}
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>
      </>
   )
}
