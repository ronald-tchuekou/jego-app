'use client'

import { IconInput } from '@/components/base/icon-input'
import { PasswordInput } from '@/components/base/password-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon, Mail } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { loginAction } from './actions'
import { defaultLoginFormValue, loginSchema, type LoginSchema } from './schema'

export default function LoginForm() {
	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: defaultLoginFormValue,
	})

	const { execute, isPending } = useAction(loginAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				form.reset(defaultLoginFormValue)
				toast.success(data.message)
			}
		},
		onError: ({ error }) => {
			toast.error(error.serverError || 'Une erreur est survenue', { duration: 8000 })
		},
	})

	const onSubmit = (data: LoginSchema) => {
		execute(data)
	}

	return (
		<Card>
			<CardHeader className='text-center'>
				<CardTitle>Connectez-vous à votre compte</CardTitle>
				<CardDescription>Entrez vos identifiants pour accéder à votre compte</CardDescription>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10 mb-5'>
						<div className='grid gap-5'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium'>Adresse e-mail</FormLabel>
										<FormControl>
											<IconInput {...field} type='email' placeholder='Entrez votre e-mail' icon={Mail} />
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
										<div className='flex items-center justify-between'>
											<FormLabel className='text-sm font-medium'>Mot de passe</FormLabel>
											<Link
												href='/auth/forgot-password'
												className='text-sm text-primary hover:underline transition-colors'
											>
												Mot de passe oublié ?
											</Link>
										</div>
										<FormControl>
											<PasswordInput {...field} placeholder='Entrez votre mot de passe' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type='submit' className='w-full' disabled={isPending}>
							{isPending && <LoaderIcon className='animate-spin' />}
							<span>Se connecter</span>
						</Button>
					</form>
				</Form>

				<div className='text-center text-sm text-muted-foreground mb-5'>
					<p>
						Vous n&apos;avez pas de compte ?{' '}
						<Link href='/auth/register' className='font-medium text-primary hover:underline transition-colors'>
							S&apos;inscrire
						</Link>
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
