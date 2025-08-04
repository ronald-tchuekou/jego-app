import '@/styles/style.css'

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <main className={``}>{children}</main>
}
