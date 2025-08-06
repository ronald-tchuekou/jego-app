import '@/styles/style.css'

export default function UserLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className={`p-10`}>
			<h1 className='text-2xl font-bold'>User Dashboard</h1>
			{children}
		</div>
	)
}
