import '@/styles/style.css'

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className={`p-10`}>
			<h1 className='text-2xl font-bold'>Admin Dashboard</h1>
			{children}
		</div>
	)
}
