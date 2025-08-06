import { Auth } from '@/services/auth-service'
import { createSafeActionClient } from 'next-safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { AUTH_COOKIE_EXPIRES_AT, AUTH_COOKIE_NAME } from './constants'
import fetchHelper from './helpers/fetch-helper'

export const actionClient = createSafeActionClient({
	defineMetadataSchema() {
		return z.object({ actionName: z.string() })
	},
})

export const authenticatedActionClient = createSafeActionClient({
	defineMetadataSchema() {
		return z.object({ actionName: z.string() })
	},
}).use(async ({ next }) => {
	const cookieStore = await cookies()
	const payload = cookieStore.get(AUTH_COOKIE_NAME)?.value

	if (!payload) throw new Error('No session found.')

	const auth = JSON.parse(payload) as Auth
	const response = await fetchHelper<Auth>('/me/revalidate-token', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${auth.token}`,
		},
	})

	const newAuth = { ...auth, user: { ...auth.user, ...response.user } }
	cookieStore.set({
		name: AUTH_COOKIE_NAME,
		value: JSON.stringify(newAuth),
		httpOnly: true,
		expires: AUTH_COOKIE_EXPIRES_AT,
		path: '/',
	})

	return next({ ctx: newAuth })
})
