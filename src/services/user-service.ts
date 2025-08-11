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
		const { data, error } = await fetchHelper<{ user: UserModel }>('/me')
		if (error) throw new Error(error)
		return data?.user
	},
	async revalidateMe(token: string) {
		const { data, error } = await fetchHelper<Auth>('/me/revalidate-token', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		if (error) throw new Error(error)
		return data
	},
	async updateMe(body: Partial<UserModel>, token: string) {
		const { data, error } = await fetchHelper<{ user: UserModel }>('/me', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		})
		if (error) throw new Error(error)
		return data?.user
	},
	async updateEmail(body: { email: string; password: string }, token: string) {
		const { data, error } = await fetchHelper<{ user: UserModel; message: string }>('/me/update-email', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		if (error) throw new Error(error)
		return data
	},
	async verifyNewEmail(code: string, token: string) {
		const { data, error } = await fetchHelper<{ user: UserModel; message: string }>('/me/verify-new-email', {
			method: 'POST',
			body: JSON.stringify({ token: code }),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		if (error) throw new Error(error)
		return data
	},
	async getUsers(filter: FilterQuery, token: string) {
		const query = objectToQueryString(filter)
		const { data, error } = await fetchHelper<PaginateResponse<UserModel>>(`/users?${query}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		if (error) throw new Error(error)
		return data
	},
	async getUserById(id: string, token: string) {
		const { data, error } = await fetchHelper<UserModel>(`/users/${id}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		if (error) throw new Error(error)
		return data
	},
	async deleteUser(id: string) {
		const { data, error } = await fetchHelper<{ message: string }>(`/users/${id}`, {
			method: 'DELETE',
		})
		if (error) throw new Error(error)
		return data
	},
	async toggleBlockUser(id: string) {
		const { data, error } = await fetchHelper<{ user: UserModel }>(`/users/${id}/toggle-block`, {
			method: 'PATCH',
		})
		if (error) throw new Error(error)
		return data?.user
	},
}

export default UserService
