import { Auth } from '@/services/auth-service'
import UserService from '@/services/user-service'
import { createSafeActionClient } from 'next-safe-action'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { AUTH_COOKIE_EXPIRES_AT, AUTH_COOKIE_NAME } from './constants'

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
	try {
		const cookieStore = await cookies()
		const payload = cookieStore.get(AUTH_COOKIE_NAME)?.value

		if (!payload) throw new Error('No session found.')

		const auth = JSON.parse(payload) as Auth
		const authResponse = await UserService.revalidateMe(auth.token)

		const newAuth = { ...auth, ...authResponse }
		cookieStore.set({
			name: AUTH_COOKIE_NAME,
			value: JSON.stringify(newAuth),
			httpOnly: true,
			expires: AUTH_COOKIE_EXPIRES_AT,
			path: '/',
		})

		return next({ ctx: newAuth })
	} catch (_err) {
		console.log('Failed to authenticate user: ', _err)
		redirect('/auth/login')
	}
})
