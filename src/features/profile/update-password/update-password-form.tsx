'use client'

import { PasswordInput } from '@/components/base/password-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LoaderIcon, Shield } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { updatePasswordAction } from '../actions'
import { defaultUpdatePasswordValue, updatePasswordSchema, type UpdatePasswordSchema } from './schema'

export default function UpdatePasswordForm() {
	const [showPasswordStrength, setShowPasswordStrength] = useState(false)

	const form = useForm<UpdatePasswordSchema>({
		resolver: zodResolver(updatePasswordSchema),
		defaultValues: defaultUpdatePasswordValue,
	})

	const { execute, isPending } = useAction(updatePasswordAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				form.reset(defaultUpdatePasswordValue)
				toast.success(data.message)
			}
		},
		onError: ({ error }) => {
			toast.error(error.serverError || 'Une erreur est survenue', { duration: 8000 })
		},
	})

	const onSubmit = (data: UpdatePasswordSchema) => {
		execute(data)
	}

	const newPassword = form.watch('newPassword')
	
	const getPasswordStrength = (password: string) => {
		let strength = 0
		const checks = {
			length: password.length >= 8,
			lowercase: /[a-z]/.test(password),
			uppercase: /[A-Z]/.test(password),
			number: /\d/.test(password),
			special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
		}
		
		strength = Object.values(checks).filter(Boolean).length
		
		return {
			score: strength,
			checks,
			label: strength < 2 ? 'Faible' : strength < 4 ? 'Moyen' : 'Fort',
			color: strength < 2 ? 'text-red-500' : strength < 4 ? 'text-yellow-500' : 'text-green-500',
			bgColor: strength < 2 ? 'bg-red-500' : strength < 4 ? 'bg-yellow-500' : 'bg-green-500',
		}
	}

	const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Shield className='w-5 h-5' />
					Mot de passe
				</CardTitle>
				<CardDescription>Mettez à jour votre mot de passe pour sécuriser votre compte</CardDescription>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						<FormField
							control={form.control}
							name='currentPassword'
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

						<FormField
							control={form.control}
							name='newPassword'
							render={({ field }) => (
								<FormItem>
									<div className='flex items-center justify-between'>
										<FormLabel className='text-sm font-medium'>Nouveau mot de passe</FormLabel>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => setShowPasswordStrength(!showPasswordStrength)}
											className='h-auto p-1 text-xs'
										>
											{showPasswordStrength ? (
												<>
													<EyeOff className='w-3 h-3 mr-1' /> Masquer
												</>
											) : (
												<>
													<Eye className='w-3 h-3 mr-1' /> Afficher la force
												</>
											)}
										</Button>
									</div>
									<FormControl>
										<PasswordInput {...field} placeholder='Entrez votre nouveau mot de passe' />
									</FormControl>

									{showPasswordStrength && newPassword && passwordStrength && (
										<div className='space-y-2'>
											<div className='flex items-center gap-2'>
												<div className='flex-1 bg-gray-200 rounded-full h-2'>
													<div
														className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.bgColor}`}
														style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
													/>
												</div>
												<span className={`text-sm font-medium ${passwordStrength.color}`}>
													{passwordStrength.label}
												</span>
											</div>

											<div className='text-xs space-y-1'>
												<div
													className={passwordStrength.checks.length ? 'text-green-600' : 'text-gray-500'}
												>
													✓ Au moins 8 caractères
												</div>
												<div
													className={
														passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-500'
													}
												>
													✓ Une lettre minuscule
												</div>
												<div
													className={
														passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-500'
													}
												>
													✓ Une lettre majuscule
												</div>
												<div
													className={passwordStrength.checks.number ? 'text-green-600' : 'text-gray-500'}
												>
													✓ Un chiffre
												</div>
												<div
													className={passwordStrength.checks.special ? 'text-green-600' : 'text-gray-500'}
												>
													✓ Un caractère spécial
												</div>
											</div>
										</div>
									)}

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='confirmNewPassword'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-sm font-medium'>Confirmer le nouveau mot de passe</FormLabel>
									<FormControl>
										<PasswordInput {...field} placeholder='Confirmez votre nouveau mot de passe' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='bg-blue-500/10 border border-blue-500/20 rounded-lg p-4'>
							<h4 className='font-medium text-blue-500 mb-2'>Conseils de sécurité :</h4>
							<ul className='text-sm text-blue-500 space-y-1'>
								<li>• Utilisez un mot de passe unique que vous n&apos;utilisez nulle part ailleurs</li>
								<li>• Combinez lettres majuscules, minuscules, chiffres et symboles</li>
								<li>• Évitez les informations personnelles facilement devinables</li>
								<li>• Considérez l&apos;utilisation d&apos;un gestionnaire de mots de passe</li>
							</ul>
						</div>

						<Button type='submit' disabled={isPending || !form.formState.isDirty}>
							{isPending && <LoaderIcon className='animate-spin' />}
							<span>Mettre à jour le mot de passe</span>
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
