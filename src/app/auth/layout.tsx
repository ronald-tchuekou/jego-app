import '@/styles/style.css'

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
			<main className={``}>
				{children}
			</main>
	)
}
