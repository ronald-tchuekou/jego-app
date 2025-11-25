'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'
import * as React from 'react'

interface TimePickerProps {
   value?: string
   onChange?: (time: string) => void
   placeholder?: string
   className?: string
}

export function TimePicker({ value, onChange, placeholder = 'Heure', className }: TimePickerProps) {
   const [isOpen, setIsOpen] = React.useState(false)
   const [hours, setHours] = React.useState(value ? Number.parseInt(value.split(':')[0]) : 0)
   const [minutes, setMinutes] = React.useState(value ? Number.parseInt(value.split(':')[1]) : 0)

   const formatTime = (h: number, m: number) => {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
   }

   const displayTime = (h: number, m: number) => {
      return `${h.toString().padStart(2, '0')}h${m.toString().padStart(2, '0')}`
   }

   const handleTimeChange = (newHours: number, newMinutes: number) => {
      setHours(newHours)
      setMinutes(newMinutes)

      const timeString = formatTime(newHours, newMinutes)
      onChange?.(timeString)
   }

   const incrementHours = () => {
      const newHours = hours === 23 ? 1 : hours + 1
      handleTimeChange(newHours, minutes)
   }

   const decrementHours = () => {
      const newHours = hours === 0 ? 23 : hours - 1
      handleTimeChange(newHours, minutes)
   }

   const incrementMinutes = () => {
      const newMinutes = minutes === 59 ? 0 : minutes + 1
      handleTimeChange(hours, newMinutes)
   }

   const decrementMinutes = () => {
      const newMinutes = minutes === 0 ? 59 : minutes - 1
      handleTimeChange(hours, newMinutes)
   }

   React.useEffect(() => {
      setHours(value ? Number.parseInt(value.split(':')[0]) : 0)
      setMinutes(value ? Number.parseInt(value.split(':')[1]) : 0)
   }, [value])

   return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
         <PopoverTrigger asChild>
            <Button
               variant='outline'
               className={cn(
                  'w-full justify-start text-left font-normal',
                  !value && 'text-muted-foreground',
                  className,
               )}
            >
               <Clock />
               {value ? displayTime(hours, minutes) : placeholder}
            </Button>
         </PopoverTrigger>
         <PopoverContent className='w-auto p-4' align='start'>
            <div className='flex items-center space-x-2'>
               <div className='flex flex-col items-center space-y-2'>
                  <Button variant='outline' size='sm' onClick={incrementHours} className='h-8 w-8 p-0 bg-transparent'>
                     +
                  </Button>
                  <Input
                     type='number'
                     min='0'
                     max='23'
                     value={hours}
                     onChange={(e) => {
                        const val = Number.parseInt(e.target.value)
                        if (val >= 0 && val <= 23) {
                           handleTimeChange(val, minutes)
                        }
                     }}
                     className='w-16 text-center'
                  />
                  <Button variant='outline' size='sm' onClick={decrementHours} className='h-8 w-8 p-0 bg-transparent'>
                     -
                  </Button>
               </div>

               <div className='text-2xl font-bold'>:</div>

               <div className='flex flex-col items-center space-y-2'>
                  <Button variant='outline' size='sm' onClick={incrementMinutes} className='h-8 w-8 p-0 bg-transparent'>
                     +
                  </Button>
                  <Input
                     type='number'
                     min='0'
                     max='59'
                     value={minutes.toString().padStart(2, '0')}
                     onChange={(e) => {
                        const val = Number.parseInt(e.target.value)
                        if (val >= 0 && val <= 59) {
                           handleTimeChange(hours, val)
                        }
                     }}
                     className='w-16 text-center'
                  />
                  <Button variant='outline' size='sm' onClick={decrementMinutes} className='h-8 w-8 p-0 bg-transparent'>
                     -
                  </Button>
               </div>
            </div>
         </PopoverContent>
      </Popover>
   )
}
