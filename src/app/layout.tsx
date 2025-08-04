import QueryProviders from '@/components/providers/query-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import '@/styles/style.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: {
		default: "JeGo - Votre source d'information fiable dans tout les villes du Cameroun",
		template: '%s | JeGo',
	},
	description: "Votre source d'information fiable dans tout les villes du Cameroun",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='fr'>
			<body className={`antialiased`}>
				<ThemeProvider defaultTheme='system' storageKey='ui-theme'>
					<QueryProviders>
						{children}
						<Toaster richColors position='top-center' duration={6000} />
					</QueryProviders>
				</ThemeProvider>
			</body>
		</html>
	)
}
