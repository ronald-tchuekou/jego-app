import fetchHelper from '@/lib/helpers/fetch-helper'
import { DateTime } from 'luxon'
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
	verifiedAt: DateTime | null
	lastLoginAt: DateTime | null
	blockedAt: DateTime | null
	createdAt: DateTime
	updatedAt: DateTime
	company?: CompanyModel
	posts?: PostModel[]
}

const UserService = {
	async getMe() {
		const response = await fetchHelper<{ user: UserModel }>('/me')
		return response.user
	},
	async revalidateMe(token: string) {
		const response = await fetchHelper<{ user: UserModel }>('/me/revalidate-token', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		return response.user
	},
	async updateMe(data: Partial<UserModel>) {
		const response = await fetchHelper<{ user: UserModel }>('/me', {
			method: 'PUT',
			body: JSON.stringify(data),
		})
		return response.user
	},
}

export default UserService
