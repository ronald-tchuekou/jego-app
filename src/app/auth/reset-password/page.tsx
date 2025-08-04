import ResetPasswordForm from '@/features/auth/reset-password/reset-password-form'

export default function ResetPasswordPage() {
	return (
		<div className='container mx-auto flex min-h-screen items-center justify-center px-4'>
			<div className='w-full max-w-md'>
				<ResetPasswordForm />
			</div>
		</div>
	)
}
