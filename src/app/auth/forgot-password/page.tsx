import ForgotPassForm from '@/features/auth/forgot-pass/forgot-pass-form'

export default function ForgotPasswordPage() {
	return (
		<div className='container mx-auto flex min-h-screen items-center justify-center px-4'>
			<div className='w-full max-w-md'>
				<ForgotPassForm />
			</div>
		</div>
	)
}
