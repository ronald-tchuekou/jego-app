'use client'

import { IconInput } from '@/components/base/icon-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, LoaderIcon, Mail } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { forgotPasswordAction } from './actions'
import { defaultForgotPasswordValue, forgotPasswordSchema, type ForgotPasswordSchema } from './schema'

export default function ForgotPassForm() {
	const [isCompleted, setIsCompleted] = useState(false)

	const form = useForm<ForgotPasswordSchema>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: defaultForgotPasswordValue,
	})

	const { execute, isPending } = useAction(forgotPasswordAction, {
		onSuccess: ({ data }) => {
			form.reset(defaultForgotPasswordValue)
			toast.success(data.message)
			setIsCompleted(true)
		},
		onError: ({ error }) => {
			toast.error(error.serverError || 'Une erreur est survenue', { duration: 8000 })
		},
	})

	const onSubmit = (data: ForgotPasswordSchema) => {
		execute(data)
	}

	return (
		<Card>
			{isCompleted ? (
				<>
					<CardHeader className='text-center'>
						<CheckCircle className='size-20 text-green-500 mx-auto mt-10 mb-5' />
						<CardTitle>Mot de passe oublié</CardTitle>
						<CardDescription>
							Un lien de réinitialisation de votre mot de passe a été envoyé à votre adresse e-mail.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button className='w-full' asChild>
							<Link href='/auth/login' replace>
								Me connecter
							</Link>
						</Button>
						<div className='h-5'></div>
					</CardContent>
				</>
			) : (
				<>
					<CardHeader className='text-center'>
						<CardTitle>Mot de passe oublié ?</CardTitle>
						<CardDescription>
							Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe
						</CardDescription>
					</CardHeader>

					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10 mb-5'>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Adresse e-mail</FormLabel>
											<FormControl>
												<IconInput {...field} type='email' placeholder='Entrez votre e-mail' icon={Mail} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type='submit' className='w-full' disabled={isPending}>
									{isPending && <LoaderIcon className='animate-spin' />}
									<span>Envoyer les instructions</span>
								</Button>
							</form>
						</Form>

						<div className='text-center text-sm text-muted-foreground mb-5'>
							<p>
								Je me rappelle de mon mot de passe{' '}
								<Link href='/auth/login' className='font-medium text-primary hover:underline transition-colors'>
									me connecter
								</Link>
							</p>
						</div>
					</CardContent>
				</>
			)}
		</Card>
	)
}
