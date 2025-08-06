import ResetLoginButton from '@/components/modals/logout-modal/reset-login-button'
import { AUTH_COOKIE_NAME } from '@/lib/constants'
import { Auth } from '@/services/auth-service'
import '@/styles/style.css'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
	admin,
	company,
	user,
}: Readonly<{
	admin: React.ReactNode
	company: React.ReactNode
	user: React.ReactNode
}>) {
	const cookieStore = await cookies()
	const authKey = cookieStore.get(AUTH_COOKIE_NAME)?.value

	if (!authKey) {
		return redirect('/auth/login')
	}

	const auth = JSON.parse(authKey) as Auth

	return (
		<main className={``}>
			{auth.user.role === 'admin' ? (
				admin
			) : auth.user.role === 'user' ? (
				user
			) : auth.user.role === 'company:agent' || auth.user.role === 'company:admin' ? (
				company
			) : (
				<div className='flex flex-col items-center justify-center h-screen'>
					<h1 className='text-2xl font-bold'>Vous n&apos;avez pas accès à cette page</h1>
					<p className='text-sm text-muted-foreground mb-5'>
						Veuillez contacter l&apos;administrateur pour obtenir un accès
					</p>
					<ResetLoginButton />
				</div>
			)}
		</main>
	)
}
