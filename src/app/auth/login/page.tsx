import LoginForm from '@/features/auth/login/login-form'

export default function LoginPage() {
	return (
		<div className='container mx-auto flex min-h-screen items-center justify-center px-4'>
			<div className='w-full max-w-md'>
				<LoginForm />
			</div>
		</div>
	)
}
