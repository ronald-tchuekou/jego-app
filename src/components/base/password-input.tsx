'use client'

import { Eye, EyeOff, LockIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface PasswordInputProps
  extends Omit<React.ComponentProps<'input'>, 'type'> {
  showToggle?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showToggle = true, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    return (
			<div className='relative'>
				<LockIcon
					className={cn('absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground')}
				/>
				<Input
					type={showPassword ? 'text' : 'password'}
					className={cn('pr-10 pl-9', className)}
					ref={ref}
					disabled={disabled}
					{...props}
				/>
				{showToggle && (
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
						onClick={togglePasswordVisibility}
						disabled={disabled}
						tabIndex={-1}
					>
						{showPassword ? (
							<EyeOff className='h-4 w-4 text-muted-foreground' />
						) : (
							<Eye className='h-4 w-4 text-muted-foreground' />
						)}
						<span className='sr-only'>{showPassword ? 'Hide password' : 'Show password'}</span>
					</Button>
				)}
			</div>
		)
  }
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
