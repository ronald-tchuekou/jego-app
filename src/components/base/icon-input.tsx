import { LucideIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { Input } from '../ui/input'

export interface IconInputProps extends React.ComponentProps<'input'> {
   icon?: LucideIcon
   iconPosition?: 'left' | 'right'
   iconClassName?: string
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
   ({ className, type, icon: Icon, iconPosition = 'left', iconClassName, ...props }, ref) => {
      return (
         <div className='relative'>
            {Icon && iconPosition === 'left' && (
               <Icon
                  className={cn('absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground', iconClassName)}
               />
            )}
            <Input
               type={type}
               className={cn(
                  Icon && iconPosition === 'left'
                     ? 'pl-9 pr-3'
                     : Icon && iconPosition === 'right'
                       ? 'pl-3 pr-9'
                       : 'px-3',
                  className,
               )}
               ref={ref}
               {...props}
            />
            {Icon && iconPosition === 'right' && (
               <Icon
                  className={cn(
                     'absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground',
                     iconClassName,
                  )}
               />
            )}
         </div>
      )
   },
)

IconInput.displayName = 'IconInput'

export { IconInput }
