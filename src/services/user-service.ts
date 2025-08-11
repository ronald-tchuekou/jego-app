import fetchHelper from '@/lib/helpers/fetch-helper'
import { objectToQueryString } from '@/lib/utils'
import { Auth } from './auth-service'
import { CompanyModel } from './company-service'
import { PostModel } from './post-service'

export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
	COMPANY_ADMIN = 'company:admin',
	COMPANY_AGENT = 'company:agent',
}

export type UserModel = {
	id: string
	firstName: string
	lastName: string
	displayName: string
	phone: string | null
	address: string | null
	city: string | null
	state: string | null
	zipCode: string | null
	country: string | null
	email: string
	password: string
	role: UserRole
	companyId: string | null
	profileImage: string | null
	verifiedAt: string | null
	lastLoginAt: string | null
	blockedAt: string | null
	createdAt: string
	updatedAt: string
	company?: CompanyModel
	posts?: PostModel[]
}

const UserService = {
	async getMe() {
		const response = await fetchHelper<{ user: UserModel }>('/me')
		return response.user
	},
	async revalidateMe(token: string) {
		const response = await fetchHelper<Auth>('/me/revalidate-token', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		return response
	},
	async updateMe(data: Partial<UserModel>, token: string) {
		const response = await fetchHelper<{ user: UserModel }>('/me', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		})
		return response.user
	},
	async updateEmail(data: { email: string; password: string }, token: string) {
		const response = await fetchHelper<{ user: UserModel; message: string }>('/me/update-email', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		return response
	},
	async verifyNewEmail(code: string, token: string) {
		const response = await fetchHelper<{ user: UserModel; message: string }>('/me/verify-new-email', {
			method: 'POST',
			body: JSON.stringify({ token: code }),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		return response
	},
	async getUsers(filter: FilterQuery, token: string) {
		const query = objectToQueryString(filter)
		const response = await fetchHelper<PaginateResponse<UserModel>>(`/users?${query}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		return response
	},
	async getUserById(id: string, token: string) {
		const response = await fetchHelper<UserModel>(`/users/${id}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		return response
	},
	async deleteUser(id: string) {
		const response = await fetchHelper<{ message: string }>(`/users/${id}`, {
			method: 'DELETE',
		})
		return response
	},
	async toggleBlockUser(id: string) {
		const response = await fetchHelper<{ user: UserModel }>(`/users/${id}/toggle-block`, {
			method: 'PATCH',
		})
		return response.user
	},
}

export default UserService
