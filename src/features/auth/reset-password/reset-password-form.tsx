'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Eye, EyeOff, Loader2, Lock, Shield } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { resetPasswordAction } from './actions'
import { resetPasswordSchema, type ResetPasswordFormData } from './schema'

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
	const requirements = [
		{ regex: /.{8,}/, text: 'Au moins 8 caractères' },
		{ regex: /[A-Z]/, text: 'Une lettre majuscule' },
		{ regex: /[a-z]/, text: 'Une lettre minuscule' },
		{ regex: /\d/, text: 'Un chiffre' },
	]

	return (
		<div className='space-y-2'>
			<p className='text-sm font-medium text-muted-foreground'>Exigences du mot de passe :</p>
			<div className='space-y-1'>
				{requirements.map((req, index) => {
					const isValid = req.regex.test(password)
					return (
						<div key={index} className='flex items-center gap-2 text-xs'>
							<div className={`h-1.5 w-1.5 rounded-full ${isValid ? 'bg-green-500' : 'bg-muted'}`} />
							<span className={isValid ? 'text-green-600' : 'text-muted-foreground'}>
								{req.text}
							</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default function ResetPasswordForm() {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isResetComplete, setIsResetComplete] = useState(false)
	const searchParams = useSearchParams()
	const token = searchParams.get('token') || 'demo_token' // Default token for demo

	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
			token: token,
		},
	})

	const watchedPassword = form.watch('password')

	const { execute, isPending, result } = useAction(resetPasswordAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				setIsResetComplete(true)
			}
		},
		onError: ({ error }) => {
			console.error('Reset password error:', error)
		},
	})

	const onSubmit = (data: ResetPasswordFormData) => {
		execute(data)
	}

	if (isResetComplete) {
		return (
			<div className='w-full max-w-md space-y-6'>
				<div className='text-center space-y-2'>
					<CheckCircle className='h-16 w-16 text-green-500 mx-auto' />
					<h1 className='text-2xl font-bold tracking-tight'>Réinitialisation réussie</h1>
					<p className='text-muted-foreground'>
						Votre mot de passe a été mis à jour avec succès
					</p>
				</div>

				<Card className='border-0 shadow-lg'>
					<CardContent className='pt-6 space-y-4'>
						<div className='text-center space-y-4'>
							<p className='text-sm text-muted-foreground'>
								Vous pouvez maintenant vous connecter à votre compte avec votre nouveau mot de passe.
							</p>
							
							<Button className='w-full' asChild>
								<Link href='/auth/login'>
									Continuer vers la connexion
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className='w-full max-w-md space-y-6'>
			<div className='text-center space-y-2'>
				<Shield className='h-12 w-12 text-primary mx-auto' />
				<h1 className='text-2xl font-bold tracking-tight'>Réinitialisez votre mot de passe</h1>
				<p className='text-muted-foreground'>
					Entrez votre nouveau mot de passe ci-dessous
				</p>
			</div>

			<Card className='border-0 shadow-lg'>
				<CardHeader className='space-y-4 pb-8'>
					<div className='space-y-2 text-center'>
						<CardTitle className='text-xl'>Créer un nouveau mot de passe</CardTitle>
						<CardDescription>
							Assurez-vous que votre nouveau mot de passe est fort et sécurisé
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent className='space-y-6'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium'>Nouveau mot de passe</FormLabel>
										<FormControl>
											<div className='relative'>
												<Lock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
												<Input
													{...field}
													type={showPassword ? 'text' : 'password'}
													placeholder='Entrez le nouveau mot de passe'
													className='pl-10 pr-10 h-11'
													disabled={isPending}
												/>
												<Button
													type='button'
													variant='ghost'
													size='sm'
													className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
													onClick={() => setShowPassword(!showPassword)}
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

							{watchedPassword && (
								<PasswordStrengthIndicator password={watchedPassword} />
							)}

							<FormField
								control={form.control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium'>Confirmer le nouveau mot de passe</FormLabel>
										<FormControl>
											<div className='relative'>
												<Lock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
												<Input
													{...field}
													type={showConfirmPassword ? 'text' : 'password'}
													placeholder='Confirmez le nouveau mot de passe'
													className='pl-10 pr-10 h-11'
													disabled={isPending}
												/>
												<Button
													type='button'
													variant='ghost'
													size='sm'
													className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
													onClick={() => setShowConfirmPassword(!showConfirmPassword)}
													disabled={isPending}
												>
													{showConfirmPassword ? (
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

							<Button 
								type='submit' 
								className='w-full h-11 text-base font-medium' 
								disabled={isPending}
							>
								{isPending ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Réinitialisation en cours...
									</>
								) : (
									'Réinitialiser le mot de passe'
								)}
							</Button>
						</form>
					</Form>

					<div className='text-center text-sm text-muted-foreground'>
						<p>Jetons de démonstration :</p>
						<p className='font-mono text-xs mt-1'>
							invalid_token / expired_token (affichent des erreurs)
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}