import { UsersList } from '@/features/users/list/users-list'

export default function UsersPage() {
	return (
		<div className='flex flex-col gap-4 px-4'>
			<UsersList />
		</div>
	)
}
