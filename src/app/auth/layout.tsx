import ThemeToggle from '@/components/base/theme-toggle'
import { Ripple } from '@/components/magicui/ripple'
import { AUTH_COOKIE_NAME } from '@/lib/constants'
import '@/styles/style.css'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const cookieStore = await cookies()
	const authKey = cookieStore.get(AUTH_COOKIE_NAME)?.value

	if (authKey) {
		return redirect('/')
	}

	return (
		<>
			<main className={`container mx-auto flex flex-col gap-5 min-h-screen items-center justify-center px-4 z-0`}>
				<div className='h-14 w-40 flex-none bg-red-500' />
				<div className='w-full max-w-md'>{children}</div>
			</main>
			<div className='fixed top-5 right-5'>
				<ThemeToggle />
			</div>
			<div className='fixed top-0 left-0 h-screen w-screen z-[-1]'>
				<Ripple numCircles={10} mainCircleSize={500} />
			</div>
		</>
	)
}
