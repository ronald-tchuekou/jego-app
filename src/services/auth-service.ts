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
		const response = await fetchHelper<Auth>('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})
		return response
	},
	register: async (body: RegisterSchema) => {
		const response = await fetchHelper<Auth>('/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
		return response
	},
	verifyEmail: async (token: string, userId: string) => {
		const response = await fetchHelper<Auth>('/auth/verify-email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token, userId }),
		})
		return response
	},
	logout: async (token: string) => {
		const response = await fetchHelper<{ message: string }>('/auth/logout', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return response
	},
	forgotPassword: async (email: string) => {
		const response = await fetchHelper<{ message: string }>('/auth/forgot-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
		})
		return response
	},
	resetPassword: async (body: ResetPasswordSchema) => {
		const response = await fetchHelper<Auth>('/auth/reset-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
		return response
	},
}

export default AuthService;
