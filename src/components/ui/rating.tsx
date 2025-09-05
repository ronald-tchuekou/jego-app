'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface RatingProps {
   value: number
   maxRating?: number
   size?: 'sm' | 'md' | 'lg'
   showValue?: boolean
   className?: string
}

export function Rating({ value, maxRating = 5, size = 'md', showValue = false, className }: RatingProps) {
   const clampedValue = Math.max(0, Math.min(maxRating, value))

   const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
   }

   const textSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
   }

   return (
      <div className={cn('flex items-center gap-2', className)}>
         <div className='flex items-center gap-0.5'>
            {Array.from({ length: maxRating }, (_, index) => {
               const fillPercentage = Math.max(0, Math.min(1, clampedValue - index))

               return (
                  <div key={index} className='relative transition-transform duration-200 hover:scale-110'>
                     {/* Background star (empty) */}
                     <Star
                        className={cn(sizeClasses[size], 'text-muted-foreground/30 transition-colors duration-300')}
                        fill='currentColor'
                     />

                     {/* Foreground star (filled) */}
                     <div
                        className='absolute inset-0 overflow-hidden transition-all duration-500 ease-out'
                        style={{
                           width: `${fillPercentage * 100}%`,
                        }}
                     >
                        <Star
                           className={cn(sizeClasses[size], 'text-amber-400 transition-colors duration-300')}
                           fill='currentColor'
                        />
                     </div>
                  </div>
               )
            })}
         </div>

         {showValue && (
            <span className={cn('font-medium transition-colors duration-300', textSizeClasses[size])}>
               {clampedValue.toFixed(1)}/5
            </span>
         )}
      </div>
   )
}
