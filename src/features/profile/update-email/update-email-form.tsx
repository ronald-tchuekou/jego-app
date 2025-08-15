'use client'

import { IconInput } from '@/components/base/icon-input'
import { PasswordInput } from '@/components/base/password-input'
import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon, Mail } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { updateEmailAction } from '../actions'
import { EmailVerificationModal } from './email-verification-modal'
import { defaultUpdateEmailValue, updateEmailSchema, type UpdateEmailSchema } from './schema'

export default function UpdateEmailForm() {
	const { auth } = useAuth()
	const user = auth?.user

	const [showVerificationModal, setShowVerificationModal] = useState(false)
	const [pendingEmail, setPendingEmail] = useState<string>('')

	const form = useForm<UpdateEmailSchema>({
		resolver: zodResolver(updateEmailSchema),
		defaultValues: defaultUpdateEmailValue,
	})

	const { execute, isPending } = useAction(updateEmailAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				setPendingEmail(form.getValues('email'))
				setShowVerificationModal(true)
				toast.success(data.message)
			}
		},
		onError: ({ error }) => {
			toast.error(error.serverError || 'Une erreur est survenue', { duration: 8000 })
		},
	})

	const onSubmit = (data: UpdateEmailSchema) => {
		execute(data)
	}

	const handleVerificationSuccess = () => {
		setShowVerificationModal(false)
		form.reset({
			...defaultUpdateEmailValue,
			email: pendingEmail,
		})
		setPendingEmail('')
		toast.success('Votre adresse e-mail a été mise à jour avec succès')
	}

	const handleVerificationCancel = () => {
		setShowVerificationModal(false)
		setPendingEmail('')
	}

	useEffect(() => {
		if (user?.email) {
			form.reset({
				...defaultUpdateEmailValue,
				email: user.email,
			})
		}
	}, [user?.email, form])

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Adresse e-mail</CardTitle>
					<CardDescription>Mettez à jour votre adresse e-mail</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium'>Nouvelle adresse e-mail</FormLabel>
										<FormControl>
											<IconInput
												{...field}
												type='email'
												placeholder='Entrez votre nouvelle adresse e-mail'
												icon={Mail}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium'>Mot de passe actuel</FormLabel>
										<FormControl>
											<PasswordInput {...field} placeholder='Entrez votre mot de passe actuel' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='bg-orange-500/10 border border-orange-500/20 rounded-lg p-4'>
								<p className='text-sm text-orange-500'>
									<strong>Important:</strong> Un code de vérification sera envoyé à votre nouvelle adresse
									e-mail. Vous devrez confirmer le changement avant qu&apos;il ne soit effectif.
								</p>
							</div>

							<Button type='submit' disabled={isPending || !form.formState.isDirty}>
								{isPending && <LoaderIcon className='animate-spin' />}
								<span>Demander le changement d&apos;e-mail</span>
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			<EmailVerificationModal
				isOpen={showVerificationModal}
				onClose={handleVerificationCancel}
				onSuccess={handleVerificationSuccess}
				newEmail={pendingEmail}
			/>
		</>
	)
}
