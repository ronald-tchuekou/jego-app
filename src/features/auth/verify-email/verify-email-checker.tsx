'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { CheckCircleIcon, LoaderIcon, XCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { verifyEmailAction } from './actions'

type Props = {
	token: string
	userId: string
}

export default function VerifyEmailChecker({ token, userId }: Props) {

	const { data, isPending, error } = useQuery({
		queryKey: ['verify-email', token, userId],
		async queryFn({ queryKey }) {
			const [, token, userId] = queryKey
			const response = await verifyEmailAction({ token, userId })

			if(response.validationErrors){
				throw new Error(response.validationErrors._errors?.join(',\n '))
			}

			if (response.serverError) {
				throw new Error(response.serverError)
			}

			return response.data
		},
	})

	return (
		<Card>
			<CardHeader className='text-center'>
				<CardTitle className='text-xl'>Vérification de l&apos;e-mail</CardTitle>
				<CardDescription>
					{isPending
						? 'Vérification de votre adresse e-mail en cours...'
						: data?.success
						? 'Vérification réussie'
						: error
						? 'Erreur de vérification'
						: 'Lien invalide'}
				</CardDescription>
			</CardHeader>

			<CardContent className='mb-5'>
				<div className='flex flex-col items-center text-center space-y-4'>
					{isPending ? (
						<>
							<LoaderIcon className='size-16 text-primary animate-spin' />
							<p className='text-muted-foreground'>
								Veuillez patienter pendant que nous vérifions votre adresse e-mail...
							</p>
						</>
					) :
						data?.success ? (
							<>
								<CheckCircleIcon className='size-16 text-green-500' />
								<div className='space-y-2 mb-5'>
									<p className='text-green-700 dark:text-green-400 font-medium'>
										E-mail vérifié avec succès !
									</p>
									<p className='text-sm text-muted-foreground'>{data?.message}</p>
								</div>
							</>
						) : data?.success ? (
						<>
							<CheckCircleIcon className='size-16 text-green-500' />
							<div className='space-y-2 mb-5'>
								<p className='text-green-700 dark:text-green-400 font-medium'>E-mail vérifié avec succès !</p>
								<p className='text-sm text-muted-foreground'>{data?.message}</p>
							</div>
						</>
					) : (!data?.success || error) ? (
						<>
							<XCircleIcon className='size-16 text-red-500' />
							<div className='space-y-2 mb-5'>
								<p className='text-red-700 dark:text-red-400 font-medium'>
									{!data?.success ? 'Lien invalide' : 'Échec de la vérification'}
								</p>
								<p className='text-sm text-muted-foreground'>{data?.message}</p>
							</div>
						</>
					) : null}
				</div>

				<div className='space-y-3'>
					{isPending ? (
						<div className='text-center'>
							<Link
								href='/auth/login'
								className='text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline'
							>
								Retour à la connexion
							</Link>
						</div>
					) : data?.success ? (
						<Button className='w-full' asChild>
							<Link href='/'>Continuer</Link>
						</Button>
					) : (!data?.success || error) ? (
						<>
							<Button className='w-full' asChild>
								<Link href='/auth/register'>Créer un nouveau compte</Link>
							</Button>
							<div className='text-center'>
								<Link
									href='/auth/login'
									className='text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline'
								>
									Déjà un compte ? Se connecter
								</Link>
							</div>
						</>
					) : null}
				</div>
			</CardContent>
		</Card>
	)
}
