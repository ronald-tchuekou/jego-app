'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { PasswordInput } from '@/components/base/password-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { resetPasswordAction } from './actions'
import { defaultResetPasswordValue, resetPasswordSchema, type ResetPasswordSchema } from './schema'

export default function ResetPasswordForm() {
	const searchParams = useSearchParams()
	const token = searchParams.get('token') || 'none'

	const form = useForm<ResetPasswordSchema>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { ...defaultResetPasswordValue, token },
	})

	const { execute, isPending } = useAction(resetPasswordAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				form.reset(defaultResetPasswordValue)
				toast.success(data.message)
			}
		},
		onError: ({ error }) => {
			toast.error(error.serverError || 'Une erreur est survenue', { duration: 8000 })
		},
	})

	const onSubmit = (data: ResetPasswordSchema) => {
		execute(data)
	}

	return (
		<Card>
			<CardHeader className='text-center'>
				<CardTitle>Créer un nouveau mot de passe</CardTitle>
				<CardDescription>Assurez-vous que votre nouveau mot de passe est fort et sécurisé</CardDescription>
			</CardHeader>

			<CardContent className='space-y-6'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10 mb-5'>
						<div className='grid gap-5'>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nouveau mot de passe</FormLabel>
										<FormControl>
											<PasswordInput {...field} placeholder='Entrez le nouveau mot de passe' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='passwordConfirmation'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirmer le nouveau mot de passe</FormLabel>
										<FormControl>
											<PasswordInput {...field} placeholder='Confirmez le nouveau mot de passe' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button type='submit' className='w-full h-11 text-base font-medium' disabled={isPending}>
							{isPending ? (
								<>
									<LoaderIcon className='mr-2 h-4 w-4 animate-spin' />
									Réinitialisation en cours...
								</>
							) : (
								'Réinitialiser le mot de passe'
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}