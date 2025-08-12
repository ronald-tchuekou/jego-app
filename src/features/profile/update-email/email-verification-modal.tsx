'use client'

import { IconInput } from '@/components/base/icon-input'
import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon, Mail, RefreshCw, Timer } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { resendEmailVerificationAction, verifyEmailChangeAction } from '../actions'
import { defaultVerifyEmailChangeValue, verifyEmailChangeSchema, type VerifyEmailChangeSchema } from './schema'

interface EmailVerificationModalProps {
	isOpen: boolean
	onClose: () => void
	onSuccess: () => void
	newEmail: string
}

export function EmailVerificationModal({ isOpen, onClose, onSuccess, newEmail }: EmailVerificationModalProps) {
	const { revalidateAuth } = useAuth()
	const [cooldownTime, setCooldownTime] = useState(0)
	const [isInCooldown, setIsInCooldown] = useState(false)

	const form = useForm<VerifyEmailChangeSchema>({
		resolver: zodResolver(verifyEmailChangeSchema),
		defaultValues: defaultVerifyEmailChangeValue,
	})

	const { execute: executeVerify, isPending: isVerifying } = useAction(verifyEmailChangeAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				onSuccess()
				form.reset()
				revalidateAuth()
			}
		},
		onError: ({ error }) => {
			toast.error(error.serverError || 'Code de vérification invalide', { duration: 8000 })
		},
	})

	const { execute: executeResend, isPending: isResending } = useAction(resendEmailVerificationAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				toast.success('Code de vérification renvoyé')
				// Start cooldown timer (60 seconds)
				setCooldownTime(60)
				setIsInCooldown(true)
			}
		},
		onError: ({ error }) => {
			toast.error(error.serverError || 'Impossible de renvoyer le code', { duration: 8000 })
		},
	})

	const onSubmit = (data: VerifyEmailChangeSchema) => {
		executeVerify(data)
	}

	const handleResendCode = () => {
		if (!isInCooldown) {
			executeResend()
		}
	}

	const handleClose = () => {
		form.reset()
		onClose()
	}

	// Countdown timer effect
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null

		if (isInCooldown && cooldownTime > 0) {
			interval = setInterval(() => {
				setCooldownTime((prevTime) => {
					if (prevTime <= 1) {
						setIsInCooldown(false)
						return 0
					}
					return prevTime - 1
				})
			}, 1000)
		}

		return () => {
			if (interval) {
				clearInterval(interval)
			}
		}
	}, [isInCooldown, cooldownTime])

	// Reset cooldown when modal closes
	useEffect(() => {
		if (!isOpen) {
			setCooldownTime(0)
			setIsInCooldown(false)
		}
	}, [isOpen])

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Mail className='w-5 h-5' />
						Vérification e-mail
					</DialogTitle>
					<DialogDescription>
						Un code de vérification a été envoyé à <strong>{newEmail}</strong>. Veuillez entrer ce code pour
						confirmer le changement d&apos;adresse e-mail.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						<FormField
							control={form.control}
							name='verificationCode'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-sm font-medium'>Code de vérification</FormLabel>
									<FormControl>
										<IconInput
											{...field}
											placeholder='Entrez le code à 6 chiffres'
											icon={Mail}
											maxLength={6}
											className='text-lg tracking-widest'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='flex flex-col space-y-3'>
							<Button type='submit' className='w-full' disabled={isVerifying || isResending}>
								{isVerifying && <LoaderIcon className='animate-spin' />}
								<span>Vérifier le code</span>
							</Button>

							<Button
								type='button'
								variant='outline'
								onClick={handleResendCode}
								disabled={isResending || isVerifying || isInCooldown}
								className='w-full transition-all duration-200'
							>
								{isResending ? (
									<RefreshCw className='animate-spin w-4 h-4 mr-2' />
								) : isInCooldown ? (
									<Timer className='w-4 h-4 mr-2 text-muted-foreground' />
								) : (
									<RefreshCw className='w-4 h-4 mr-2' />
								)}
								<span>{isInCooldown ? `Renvoyer le code (${cooldownTime}s)` : 'Renvoyer le code'}</span>
							</Button>

							<Button
								type='button'
								variant='ghost'
								onClick={handleClose}
								className='w-full'
								disabled={isVerifying || isResending}
							>
								Annuler
							</Button>
						</div>
					</form>
				</Form>

				<div className='text-xs text-muted-foreground text-center space-y-1'>
					<p>Le code expire dans 10 minutes</p>
					{isInCooldown && (
						<p className='text-amber-600 dark:text-amber-400 font-medium'>
							Vous pourrez renvoyer un nouveau code dans {cooldownTime} seconde{cooldownTime > 1 ? 's' : ''}
						</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
