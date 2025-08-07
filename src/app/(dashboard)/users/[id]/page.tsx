import { AlertTriangle, ArrowLeft, Building, Calendar, Mail, MapPin, Phone } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AUTH_COOKIE_NAME } from '@/lib/constants'
import UserService, { UserModel, UserRole } from '@/services/user-service'

interface UserDetailPageProps {
	params: {
		id: string
	}
}

async function getUserData(id: string): Promise<UserModel | null> {
	try {
		const cookieStore = await cookies()
		const payload = cookieStore.get(AUTH_COOKIE_NAME)?.value

		if (!payload) {
			throw new Error('Token non trouvé')
		}

		const { token } = JSON.parse(payload)
		const user = await UserService.getUserById(id, token)
		return user
	} catch (error) {
		console.error("Erreur lors du chargement de l'utilisateur:", error)
		return null
	}
}

// Helper function to get role badge variant
function getRoleBadgeVariant(role: UserRole) {
	switch (role) {
		case UserRole.ADMIN:
			return 'destructive'
		case UserRole.COMPANY_ADMIN:
			return 'default'
		case UserRole.COMPANY_AGENT:
			return 'secondary'
		default:
			return 'outline'
	}
}

// Helper function to get role label in French
function getRoleLabel(role: UserRole) {
	switch (role) {
		case UserRole.ADMIN:
			return 'Administrateur'
		case UserRole.COMPANY_ADMIN:
			return 'Admin Entreprise'
		case UserRole.COMPANY_AGENT:
			return 'Agent Entreprise'
		case UserRole.USER:
			return 'Utilisateur'
		default:
			return role
	}
}

// Helper function to format date
function formatDate(date: string | null) {
	if (!date) return 'Non défini'
	return Intl.DateTimeFormat('fr-FR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(new Date(date))
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
	const user = await getUserData(params.id)

	if (!user) {
		notFound()
	}

	const initials = `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`
	const isBlocked = user.blockedAt !== null
	const isVerified = user.verifiedAt !== null

	return (
		<div className='flex flex-col gap-6 px-4 py-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href='/users'>
						<Button variant='outline' size='icon'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<div>
						<h1 className='text-2xl font-bold'>Détails de l&apos;utilisateur</h1>
						<p className='text-muted-foreground'>Informations détaillées du compte utilisateur</p>
					</div>
				</div>
			</div>

			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
				{/* Profile Card */}
				<Card className='md:col-span-1'>
					<CardHeader className='text-center pb-4'>
						<div className='flex justify-center mb-4'>
							<Avatar className='h-20 w-20'>
								<AvatarImage src={user.profileImage || undefined} alt={user.displayName} />
								<AvatarFallback className='text-lg'>{initials}</AvatarFallback>
							</Avatar>
						</div>
						<CardTitle className='text-xl'>{user.displayName}</CardTitle>
						<CardDescription className='flex items-center justify-center gap-2'>
							<Badge variant={getRoleBadgeVariant(user.role)}>{getRoleLabel(user.role)}</Badge>
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='flex items-center justify-between'>
							<span className='text-sm font-medium'>Statut du compte</span>
							<Badge variant={isBlocked ? 'destructive' : 'default'}>{isBlocked ? 'Bloqué' : 'Actif'}</Badge>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm font-medium'>Vérification</span>
							<Badge variant={isVerified ? 'default' : 'secondary'}>
								{isVerified ? 'Vérifié' : 'Non vérifié'}
							</Badge>
						</div>
						{isBlocked && (
							<div className='flex items-center gap-2 p-2 bg-destructive/10 rounded-md'>
								<AlertTriangle className='h-4 w-4 text-destructive' />
								<span className='text-sm text-destructive'>Compte bloqué le {formatDate(user.blockedAt)}</span>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Contact Information */}
				<Card className='md:col-span-1'>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Mail className='h-5 w-5' />
							Informations de contact
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='space-y-2'>
							<div className='flex items-center gap-2'>
								<Mail className='h-4 w-4 text-muted-foreground' />
								<span className='text-sm font-medium'>Email</span>
							</div>
							<p className='text-sm text-muted-foreground ml-6'>{user.email}</p>
						</div>

						{user.phone && (
							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									<Phone className='h-4 w-4 text-muted-foreground' />
									<span className='text-sm font-medium'>Téléphone</span>
								</div>
								<p className='text-sm text-muted-foreground ml-6'>{user.phone}</p>
							</div>
						)}

						{(user.address || user.city || user.country) && (
							<>
								<Separator />
								<div className='space-y-2'>
									<div className='flex items-center gap-2'>
										<MapPin className='h-4 w-4 text-muted-foreground' />
										<span className='text-sm font-medium'>Adresse</span>
									</div>
									<div className='ml-6 text-sm text-muted-foreground space-y-1'>
										{user.address && <p>{user.address}</p>}
										{(user.city || user.zipCode) && (
											<p>
												{user.zipCode && `${user.zipCode} `}
												{user.city}
											</p>
										)}
										{user.state && <p>{user.state}</p>}
										{user.country && <p>{user.country}</p>}
									</div>
								</div>
							</>
						)}
					</CardContent>
				</Card>

				{/* Company and Activity */}
				<Card className='md:col-span-2 lg:col-span-1'>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Building className='h-5 w-5' />
							Entreprise et Activité
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='space-y-2'>
							<span className='text-sm font-medium'>Entreprise associée</span>
							<p className='text-sm text-muted-foreground'>
								{user.company ? user.company.name : 'Aucune entreprise associée'}
							</p>
						</div>

						<Separator />

						<div className='space-y-2'>
							<div className='flex items-center gap-2'>
								<Calendar className='h-4 w-4 text-muted-foreground' />
								<span className='text-sm font-medium'>Dernière connexion</span>
							</div>
							<p className='text-sm text-muted-foreground ml-6'>{formatDate(user.lastLoginAt)}</p>
						</div>

						<div className='space-y-2'>
							<div className='flex items-center gap-2'>
								<Calendar className='h-4 w-4 text-muted-foreground' />
								<span className='text-sm font-medium'>Date d&apos;inscription</span>
							</div>
							<p className='text-sm text-muted-foreground ml-6'>{formatDate(user.createdAt)}</p>
						</div>

						<div className='space-y-2'>
							<div className='flex items-center gap-2'>
								<Calendar className='h-4 w-4 text-muted-foreground' />
								<span className='text-sm font-medium'>Dernière modification</span>
							</div>
							<p className='text-sm text-muted-foreground ml-6'>{formatDate(user.updatedAt)}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
