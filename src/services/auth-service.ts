import { RegisterSchema } from "@/features/auth/register/schema";
import { ResetPasswordSchema } from '@/features/auth/reset-password/schema'
import fetchHelper from '@/lib/helpers/fetch-helper'
import { UserModel } from './user-service'

export type Auth = {
	user: UserModel
	token: string
}

const AuthService = {
	login: async ({ email, password }: { email: string; password: string }) => {
		try {
			const { data, error } = await fetchHelper<Auth>('/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			})

			if (error) throw new Error(error)

			return data
		} catch (error: any) {
			throw new Error(error.message)
		}
	},
	register: async (body: RegisterSchema) => {
		const { data, error } = await fetchHelper<Auth>('/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		if (error) throw new Error(error)

		return data
	},
	verifyEmail: async (token: string, userId: string) => {
		const { data, error } = await fetchHelper<Auth>('/auth/verify-email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token, userId }),
		})

		if (error) throw new Error(error)

		return data
	},
	logout: async (token: string) => {
		const { data, error } = await fetchHelper<{ message: string }>('/auth/logout', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (error) throw new Error(error)

		return data
	},
	forgotPassword: async (email: string) => {
		const { data, error } = await fetchHelper<{ message: string }>('/auth/forgot-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
		})

		if (error) throw new Error(error)

		return data
	},
	resetPassword: async (body: ResetPasswordSchema) => {
		const { data, error } = await fetchHelper<Auth>('/auth/reset-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		if (error) throw new Error(error)

		return data
	},
}

export default AuthService;
