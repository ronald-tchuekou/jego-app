'use client'

import { Auth } from '@/services/auth-service'
import { useAction } from 'next-safe-action/hooks'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { revalidateUserAction } from './actions'

const AuthContext = createContext<{ auth: Auth | null; revalidateAuth: VoidFunction }>({
	auth: null,
	revalidateAuth: () => {},
})

export function useAuth() {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('useAuth must be used within a AuthProvider.')
	}

	return context
}

export function AuthProvider({ children, auth: initialAuth }: { children: React.ReactNode; auth: Auth | null }) {
	const [auth, setAuth] = useState<Auth | null>(null)

	const { execute } = useAction(revalidateUserAction, {
		onSuccess: (data) => {
			setAuth(data.data)
		},
	})

	const revalidateAuth = async () => {
		execute()
	}

	useEffect(() => {
		setAuth(initialAuth)
	}, [initialAuth])

	return <AuthContext value={{ auth, revalidateAuth }}>{children}</AuthContext>
}
