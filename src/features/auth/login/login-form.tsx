'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginAction } from './actions'
import { loginSchema, type LoginFormData } from './schema'

export default function LoginForm() {
	const [showPassword, setShowPassword] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	})

	const { execute, isPending, result } = useAction(loginAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				setSuccessMessage(data.message || 'Login successful!')
				form.reset()
				// In a real app, you would redirect to dashboard or home page
				// router.push('/dashboard')
			}
		},
		onError: ({ error }) => {
			console.error('Login error:', error)
		},
	})

	const onSubmit = (data: LoginFormData) => {
		setSuccessMessage('')
		execute(data)
	}

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	return (
		<div className='w-full max-w-md space-y-6'>
			<div className='text-center space-y-2'>
				<h1 className='text-2xl font-bold tracking-tight'>Bon retour</h1>
				<p className='text-muted-foreground'>Entrez vos identifiants pour accéder à votre compte</p>
			</div>

			<Card className='border-0 shadow-lg'>
				<CardHeader className='space-y-4 pb-8'>
					<div className='space-y-2 text-center'>
						<CardTitle className='text-xl'>Connectez-vous à votre compte</CardTitle>
						<CardDescription>
							Vous n'avez pas de compte ?{' '}
							<Link href='/auth/register' className='font-medium text-primary hover:underline transition-colors'>
								S'inscrire
							</Link>
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
											<div className='relative'>
												<Lock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
												<Input
													{...field}
													type={showPassword ? 'text' : 'password'}
													placeholder='Entrez votre mot de passe'
													className='pl-10 pr-10 h-11'
													disabled={isPending}
												/>
												<Button
													type='button'
													variant='ghost'
													size='sm'
													className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
													onClick={togglePasswordVisibility}
													disabled={isPending}
												>
													{showPassword ? (
														<EyeOff className='h-4 w-4 text-muted-foreground' />
													) : (
														<Eye className='h-4 w-4 text-muted-foreground' />
													)}
												</Button>
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

							{successMessage && (
								<div className='p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md'>
									{successMessage}
								</div>
							)}

							<Button type='submit' className='w-full h-11 text-base font-medium' disabled={isPending}>
								{isPending ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Connexion en cours...
									</>
								) : (
									'Se connecter'
								)}
							</Button>
						</form>
					</Form>

					<div className='text-center text-sm text-muted-foreground'>
						<p>Identifiants de démonstration :</p>
						<p className='font-mono text-xs mt-1'>demo@example.com / password123</p>
						<p className='font-mono text-xs'>error@example.com (affiche une erreur)</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
