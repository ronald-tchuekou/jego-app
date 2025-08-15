import SearchInput from '@/components/base/search-input'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import AccountStatusFilter from '@/features/users/list/account-status-filter'
import RoleFilter from '@/features/users/list/role-filter'
import { UsersList } from '@/features/users/list/users-list'

export default function UsersPage() {
	return (
		<>
			<DashboardTitle title='Gestion des utilisateurs' description='Gérez les utilisateurs de votre plateforme'>
				<div className='flex items-center gap-2'>
					<SearchInput />
					<RoleFilter />
					<AccountStatusFilter />
				</div>
			</DashboardTitle>
			<UsersList />
		</>
	)
}
