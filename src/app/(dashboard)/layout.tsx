import '@/styles/style.css'

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <main className={``}>{children}</main>
}
