import '@/styles/style.css'

export default function CompanyLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <main className={``}>{children}</main>
}
