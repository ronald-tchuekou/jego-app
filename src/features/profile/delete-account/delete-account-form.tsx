'use client'

import { PasswordInput } from '@/components/base/password-input'
import { useAuth } from '@/components/providers/auth'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UserRole } from '@/services/user-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, LoaderIcon, Trash2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { deleteAccountAction } from '../actions'
import { defaultDeleteAccountValue, deleteAccountSchema, type DeleteAccountSchema } from './schema'

export default function DeleteAccountForm() {
	const { auth } = useAuth()
	const userEmail = auth?.user?.email
	const [showConfirmDialog, setShowConfirmDialog] = useState(false)

	const form = useForm<DeleteAccountSchema>({
		resolver: zodResolver(deleteAccountSchema),
		defaultValues: defaultDeleteAccountValue,
	})

	const { execute, isPending } = useAction(deleteAccountAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				toast.success(data.message)
			}
		},
		onError: ({ error }) => {
			toast.error(error.serverError || 'Une erreur est survenue', { duration: 8000 })
			setShowConfirmDialog(false)
		},
	})

	const onSubmit = (data: DeleteAccountSchema) => {
		setShowConfirmDialog(true)
		console.log('onSubmit', data)
	}

	const handleConfirmDelete = () => {
		const formData = form.getValues()
		execute(formData)
	}

	const handleCancelDelete = () => {
		setShowConfirmDialog(false)
	}

	if (auth?.user.role === UserRole.ADMIN) {
		return null
	}

	return (
		<Card className='border-destructive'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 text-destructive'>
					<AlertTriangle className='w-5 h-5' />
					Zone de danger
				</CardTitle>
				<CardDescription>
					La suppression de votre compte est irréversible. Toutes vos données seront définitivement perdues.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className='space-y-6'>
					<div className='bg-destructive/5 border border-destructive/20 rounded-lg p-4'>
						<h4 className='font-medium text-destructive mb-2'>
							Que se passe-t-il quand vous supprimez votre compte ?
						</h4>
						<ul className='text-sm text-destructive space-y-1'>
							<li>• Votre profil et toutes vos données personnelles seront supprimés</li>
							<li>• Vos publications, commentaires et interactions seront supprimés</li>
							<li>• Vous perdrez l&apos;accès à tous vos contenus et historiques</li>
							<li>• Cette action ne peut pas être annulée</li>
						</ul>
					</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium'>Mot de passe</FormLabel>
										<FormControl>
											<PasswordInput {...field} placeholder='Entrez votre mot de passe pour confirmer' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='confirmation'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium'>
											Tapez &quot;SUPPRIMER&quot; pour confirmer
										</FormLabel>
										<FormControl>
											<Input {...field} placeholder='Tapez SUPPRIMER en majuscules' className='font-mono' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
								<AlertDialogTrigger asChild>
									<Button type='submit' variant='destructive' disabled={isPending}>
										{isPending && <LoaderIcon className='animate-spin' />}
										<Trash2 className='w-4 h-4 mr-2' />
										<span>Supprimer définitivement mon compte</span>
									</Button>
								</AlertDialogTrigger>

								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle className='flex items-center gap-2 text-red-600'>
											<AlertTriangle className='w-5 h-5' />
											Confirmer la suppression du compte
										</AlertDialogTitle>
										<AlertDialogDescription className='space-y-2'>
											<p>
												Vous êtes sur le point de supprimer définitivement votre compte{' '}
												{userEmail && <strong>({userEmail})</strong>}.
											</p>
											<p className='font-medium text-red-600'>
												Cette action est irréversible et toutes vos données seront perdues.
											</p>
											<p>Êtes-vous absolument certain de vouloir continuer ?</p>
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel onClick={handleCancelDelete}>Annuler</AlertDialogCancel>
										<AlertDialogAction
											onClick={handleConfirmDelete}
											className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
											disabled={isPending}
										>
											{isPending && <LoaderIcon className='animate-spin w-4 h-4 mr-2' />}
											Oui, supprimer mon compte
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</form>
					</Form>
				</div>
			</CardContent>
		</Card>
	)
}
