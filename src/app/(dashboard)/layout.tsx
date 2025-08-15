import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { SiteHeader } from '@/components/dashboard/site-header'
import ResetLoginButton from '@/components/modals/logout-modal/reset-login-button'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AUTH_COOKIE_NAME } from '@/lib/constants'
import { Auth } from '@/services/auth-service'
import { UserRole } from '@/services/user-service'
import '@/styles/style.css'
import { BanIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const cookieStore = await cookies()
	const authKey = cookieStore.get(AUTH_COOKIE_NAME)?.value

	if (!authKey) {
		return redirect('/auth/login')
	}

	const allowedRoles = [UserRole.ADMIN, UserRole.USER, UserRole.COMPANY_ADMIN, UserRole.COMPANY_AGENT]
	const auth = JSON.parse(authKey) as Auth

	if (auth.user.blockedAt) {
		return (
			<div className='flex flex-col items-center justify-center h-screen gap-6'>
				<BanIcon className='size-32 text-destructive' />
				<h1 className='text-2xl font-bold'>Votre compte a été bloqué</h1>
				<p className='text-sm text-muted-foreground mb-5 max-w-lg text-center'>
					Veuillez contacter l&apos;administrateur pour plus d&apos;informations. Ou bien vous vous connecter avec
					un autre compte.
				</p>
				<ResetLoginButton />
			</div>
		)
	}

	if (!allowedRoles.includes(auth.user.role)) {
		return (
			<div className='flex flex-col items-center justify-center h-screen gap-6'>
				<BanIcon className='size-32 text-destructive' />
				<h1 className='text-2xl font-bold'>Vous n&apos;avez pas accès à cette page</h1>
				<p className='text-sm text-muted-foreground mb-5 max-w-lg text-center'>
					Veuillez contacter l&apos;administrateur pour obtenir un accès
				</p>
				<ResetLoginButton />
			</div>
		)
	}

	return (
		<main className={``}>
			<SidebarProvider
				style={
					{
						'--sidebar-width': 'calc(var(--spacing) * 72)',
						'--header-height': 'calc(var(--spacing) * 12)',
					} as React.CSSProperties
				}
			>
				<AppSidebar variant='inset' />
				<SidebarInset>
					<SiteHeader />
					<div className='flex flex-1 flex-col'>
						<div className='@container/main flex flex-1 flex-col gap-2'>
							<div className='flex flex-col gap-4 p-4 md:gap-6 md:p-6'>{children}</div>
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</main>
	)
}
