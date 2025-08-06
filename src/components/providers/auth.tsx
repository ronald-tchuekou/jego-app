'use client'

import { Auth } from '@/services/auth-service'
import React, { createContext, useContext } from 'react'

const AuthContext = createContext<{ auth: Auth | null }>({ auth: null })

export function useAuth() {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('useAuth must be used within a AuthProvider.')
	}

	return context
}

export function AuthProvider({ children, auth }: { children: React.ReactNode; auth: Auth | null }) {
	return <AuthContext value={{ auth }}>{children}</AuthContext>
}
