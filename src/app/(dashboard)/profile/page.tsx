import { DeleteAccountForm, UpdateEmailForm, UpdateImageProfileForm, UpdatePasswordForm } from '@/features/profile'
import { UpdateUserInfoForm } from '@/features/profile/update-user-info'

export default function Page() {
	return (
		<div className='flex flex-col gap-6 px-5 max-w-5xl'>
			<UpdateImageProfileForm />
			<UpdateUserInfoForm />
			<UpdateEmailForm />
			<UpdatePasswordForm />
			<DeleteAccountForm />
			<div className='h-10' />
		</div>
	)
}
