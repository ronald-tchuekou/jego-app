'use client'

import { IconInput } from '@/components/base/icon-input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon, Mail, RefreshCw } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
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
	const form = useForm<VerifyEmailChangeSchema>({
		resolver: zodResolver(verifyEmailChangeSchema),
		defaultValues: defaultVerifyEmailChangeValue,
	})

	const { execute: executeVerify, isPending: isVerifying } = useAction(verifyEmailChangeAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				onSuccess()
				form.reset()
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
			}
		},
		onError: ({ error }) => {
			toast.error(error.serverError || 'Impossible de renvoyer le code', { duration: 8000 })
		},
	})

	const onSubmit = (data: VerifyEmailChangeSchema) => {
		executeVerify({ ...data, email: newEmail })
	}

	const handleResendCode = () => {
		executeResend({ email: newEmail })
	}

	const handleClose = () => {
		form.reset()
		onClose()
	}

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
							<Button type='submit' className='w-full' disabled={isVerifying}>
								{isVerifying && <LoaderIcon className='animate-spin' />}
								<span>Vérifier le code</span>
							</Button>

							<Button
								type='button'
								variant='outline'
								onClick={handleResendCode}
								disabled={isResending}
								className='w-full'
							>
								{isResending && <RefreshCw className='animate-spin w-4 h-4 mr-2' />}
								<span>Renvoyer le code</span>
							</Button>

							<Button type='button' variant='ghost' onClick={handleClose} className='w-full'>
								Annuler
							</Button>
						</div>
					</form>
				</Form>

				<div className='text-xs text-muted-foreground text-center'>
					<p>Le code expire dans 10 minutes</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}
