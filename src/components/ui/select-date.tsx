'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'

type Props = {
   value?: Date
   onChange?: (date: Date | undefined) => void
   placeholder?: string
   disabled?: boolean
   className?: string
   dateFormat?: string
   name?: string
   id?: string
   required?: boolean
   error?: boolean
   'aria-label'?: string
   'aria-describedby'?: string
}

const SelectDate = ({
   value,
   onChange,
   placeholder = 'Pick a date',
   disabled = false,
   className,
   dateFormat = 'PPP',
   name,
   id,
   required,
   error = false,
   ...props
}: Props) => {
   const [open, setOpen] = React.useState(false)
   const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value)

   // Sync with external value changes
   React.useEffect(() => {
      setSelectedDate(value)
   }, [value])

   const handleDateSelect = (date: Date | undefined) => {
      setSelectedDate(date)
      onChange?.(date)
      setOpen(false)
   }

   const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
         event.preventDefault()
         setOpen(!open)
      }
      if (event.key === 'Escape') {
         setOpen(false)
      }
   }

   return (
      <div className='relative'>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  id={id}
                  variant='outline'
                  className={cn(
                     'w-full justify-start text-left font-normal',
                     !selectedDate && 'text-muted-foreground',
                     error && 'border-destructive focus-visible:ring-destructive/20',
                     className
                  )}
                  disabled={disabled}
                  onKeyDown={handleKeyDown}
                  aria-expanded={open}
                  aria-haspopup='dialog'
                  aria-label={props['aria-label'] || 'Choose date'}
                  aria-describedby={props['aria-describedby']}
                  {...props}
               >
                  <CalendarIcon className='h-4 w-4 text-muted-foreground' />
                  {selectedDate ? format(selectedDate, dateFormat, { locale: fr }) : <span className='text-muted-foreground'>{placeholder}</span>}
               </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
               <Calendar
                  mode='single'
                  locale={fr}
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={disabled}
               />
            </PopoverContent>
         </Popover>

         {/* Hidden input for form compatibility */}
         {name && (
            <input
               type='hidden'
               name={name}
               value={selectedDate ? selectedDate.toISOString() : ''}
               required={required}
            />
         )}
      </div>
   )
}

export default SelectDate
