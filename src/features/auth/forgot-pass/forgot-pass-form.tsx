'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, CheckCircle, Loader2, Mail } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { forgotPasswordAction } from './actions'
import { forgotPasswordSchema, type ForgotPasswordFormData } from './schema'

export default function ForgotPassForm() {
	const [isEmailSent, setIsEmailSent] = useState(false)
	const [sentEmail, setSentEmail] = useState('')

	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	})

	const { execute, isPending, result } = useAction(forgotPasswordAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				setIsEmailSent(true)
				setSentEmail(form.getValues('email'))
			}
		},
		onError: ({ error }) => {
			console.error('Forgot password error:', error)
		},
	})

	const onSubmit = (data: ForgotPasswordFormData) => {
		execute(data)
	}

	const handleBackToLogin = () => {
		setIsEmailSent(false)
		form.reset()
	}

	if (isEmailSent) {
		return (
			<div className='w-full max-w-md space-y-6'>
				<div className='text-center space-y-2'>
					<CheckCircle className='h-16 w-16 text-green-500 mx-auto' />
					<h1 className='text-2xl font-bold tracking-tight'>Vérifiez votre e-mail</h1>
					<p className='text-muted-foreground'>Nous avons envoyé les instructions de réinitialisation à</p>
					<p className='font-medium text-foreground'>{sentEmail}</p>
				</div>

				<Card className='border-0 shadow-lg'>
					<CardContent className='pt-6 space-y-4'>
						<div className='text-center space-y-4'>
							<p className='text-sm text-muted-foreground'>
								Vous n'avez pas reçu l'e-mail ? Vérifiez votre dossier de courrier indésirable ou réessayez.
							</p>

							<div className='flex flex-col gap-3'>
								<Button
									variant='outline'
									className='w-full'
									onClick={() => {
										setIsEmailSent(false)
										form.setValue('email', sentEmail)
									}}
								>
									Réessayer
								</Button>

								<Button variant='ghost' className='w-full' asChild>
									<Link href='/auth/login'>
										<ArrowLeft className='mr-2 h-4 w-4' />
										Retour à la connexion
									</Link>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className='w-full max-w-md space-y-6'>
			<div className='text-center space-y-2'>
				<h1 className='text-2xl font-bold tracking-tight'>Mot de passe oublié ?</h1>
				<p className='text-muted-foreground'>
					Pas de souci, nous vous enverrons les instructions de réinitialisation
				</p>
			</div>

			<Card className='border-0 shadow-lg'>
				<CardHeader className='space-y-4 pb-8'>
					<div className='space-y-2 text-center'>
						<CardTitle className='text-xl'>Réinitialisez votre mot de passe</CardTitle>
						<CardDescription>
							Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent className='space-y-6'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium'>Adresse e-mail</FormLabel>
										<FormControl>
											<div className='relative'>
												<Mail className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
												<Input
													{...field}
													type='email'
													placeholder='Entrez votre e-mail'
													className='pl-10 h-11'
													disabled={isPending}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{result?.data?.error && (
								<div className='p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md'>
									{result.data.error}
								</div>
							)}

							<Button type='submit' className='w-full h-11 text-base font-medium' disabled={isPending}>
								{isPending ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Envoi en cours...
									</>
								) : (
									'Envoyer les instructions'
								)}
							</Button>
						</form>
					</Form>

					<div className='text-center'>
						<Button variant='ghost' className='text-sm' asChild>
							<Link href='/auth/login'>
								<ArrowLeft className='mr-2 h-4 w-4' />
								Retour à la connexion
							</Link>
						</Button>
					</div>

					<div className='text-center text-sm text-muted-foreground'>
						<p>E-mail de démonstration :</p>
						<p className='font-mono text-xs mt-1'>notfound@example.com (affiche une erreur)</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
