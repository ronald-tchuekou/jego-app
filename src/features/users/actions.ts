"use server"

import { authenticatedActionClient } from "@/lib/safe-action"
import UserService from '@/services/user-service'
import { z } from 'zod'

// Schema for get users action
const getUsersSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(10),
	search: z.string().optional(),
	role: z.string().optional(),
	status: z.string().optional(),
})

// Schema for delete user action
const deleteUserSchema = z.object({
	userId: z.string().min(1, "L'ID utilisateur est requis"),
})

// Schema for block user action
const blockUserSchema = z.object({
	userId: z.string().min(1, "L'ID utilisateur est requis"),
})

// Action to get users with pagination and filters
export const getUsersAction = authenticatedActionClient
	.metadata({ actionName: 'getUsersAction' })
	.inputSchema(getUsersSchema)
	.action(async ({ parsedInput: { page, limit, search, role, status }, ctx }) => {
		try {
			const filters: any = { page, limit }

			if (search) {
				filters.search = search
			}

			if (role && role !== 'all') {
				filters.role = role
			}

			if (status && status !== 'all') {
				if (status === 'blocked') {
					filters.blocked = true
				} else if (status === 'active') {
					filters.blocked = false
				}
			}

			return UserService.getUsers(filters, ctx.token)
		} catch (error) {
			console.error(error)
			throw new Error('Erreur lors du chargement des utilisateurs')
		}
	})

// Action to delete a user
export const deleteUserAction = authenticatedActionClient
	.metadata({ actionName: 'deleteUser' })
	.inputSchema(deleteUserSchema)
	.action(async ({ parsedInput: { userId } }) => {
		try {
			await UserService.deleteUser(userId)
			return { success: true, message: 'Utilisateur supprimé avec succès' }
		} catch (error) {
			console.error(error)
			throw new Error("Erreur lors de la suppression de l'utilisateur")
		}
	})

// Action to block/unblock a user
export const toggleBlockUserAction = authenticatedActionClient
	.metadata({ actionName: 'toggleBlockUser' })
	.inputSchema(blockUserSchema)
	.action(async ({ parsedInput: { userId } }) => {
		try {
			await UserService.toggleBlockUser(userId)
			return { success: true, message: "Statut de l'utilisateur modifié avec succès" }
		} catch (error) {
			console.error(error)
			throw new Error("Erreur lors de la modification du statut de l'utilisateur")
		}
	})
