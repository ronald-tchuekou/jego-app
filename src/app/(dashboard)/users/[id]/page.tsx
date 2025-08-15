import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import UserDetails from '@/features/users/details/user-details'

interface UserDetailPageProps {
	params: Promise<{
		id: string
	}>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
	const { id } = await params

	return (
		<>
			<DashboardTitle
				title="Détails de l'utilisateur"
				description='Informations détaillées du compte utilisateur'
				withBackButton
			/>
			<UserDetails userId={id} />
		</>
	)
}
