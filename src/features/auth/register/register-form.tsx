'use client'

import { IconInput } from '@/components/base/icon-input'
import { PasswordInput } from '@/components/base/password-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon, Mail, User } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { registerAction } from './actions'
import { defaultRegisterValue, registerSchema, type RegisterSchema } from './schema'

export default function LoginForm() {
	const form = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: defaultRegisterValue,
	})

	const { execute, isPending } = useAction(registerAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				form.reset(defaultRegisterValue)
				toast.success(data.message)
			}
		},
		onError: ({ error }) => {
			toast.error(error.serverError || 'Une erreur est survenue')
		},
	})

	const onSubmit = (data: RegisterSchema) => {
		const filteredData = Object.fromEntries(
			Object.entries(data).filter(([, value]) => value !== null && value !== undefined && value !== '')
		)
		execute(filteredData as RegisterSchema)
	}

	return (
		<Card>
			<CardHeader className='text-center'>
				<CardTitle>Créer un compte</CardTitle>
				<CardDescription>Entrez vos informations pour créer un compte</CardDescription>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10 mb-5'>
						<div className='grid gap-5'>
							<FormField
								control={form.control}
								name='firstName'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium'>Prénom</FormLabel>
										<FormControl>
											<IconInput {...field} placeholder='Entrez votre prénom' icon={User} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='lastName'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium'>Nom</FormLabel>
										<FormControl>
											<IconInput {...field} placeholder='Entrez votre nom' icon={User} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

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
										<FormLabel className='text-sm font-medium'>Mot de passe</FormLabel>
										<FormControl>
											<PasswordInput {...field} placeholder='Entrez votre mot de passe' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium'>Confirmer le mot de passe</FormLabel>
										<FormControl>
											<PasswordInput {...field} placeholder='Entrez la confirmation' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type='submit' className='w-full' disabled={isPending}>
							{isPending && <LoaderIcon className='animate-spin' />}
							<span>Créer un compte</span>
						</Button>
					</form>
				</Form>

				<div className='text-center text-sm text-muted-foreground mb-5'>
					<p>
						Vous avez déjà un compte ?{' '}
						<Link href='/auth/login' className='font-medium text-primary hover:underline transition-colors'>
							Se connecter
						</Link>
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
