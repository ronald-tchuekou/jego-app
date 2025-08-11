'use server'

import fetchHelper from '@/lib/helpers/fetch-helper'
import { authenticatedActionClient } from '@/lib/safe-action'
import UserService, { UserModel } from '@/services/user-service'
import { redirect } from 'next/navigation'
import { deleteAccountSchema } from './delete-account/schema'
import { updateEmailSchema, verifyEmailChangeSchema } from './update-email/schema'
import { updateImageProfileSchema } from './update-image-profile/schema'
import { updatePasswordSchema } from './update-password/schema'
import { updateUserInfoSchema } from './update-user-info/schema'

// Update profile image action
export const updateImageProfileAction = authenticatedActionClient
	.inputSchema(updateImageProfileSchema)
	.metadata({ actionName: 'updateImageProfileAction' })
	.action(async ({ parsedInput, ctx }) => {
		const formData = new FormData()
		formData.append('image', parsedInput.image)

		const response = await fetchHelper<{ user: UserModel }>('/me/image-profile', {
			method: 'POST',
			body: formData,
			headers: {
				Authorization: `Bearer ${ctx.token}`,
			},
		})

		if (!response.user) {
			return {
				success: false,
				message: 'Une erreur est survenue lors de la mise à jour de la photo de profil',
			}
		}

		return {
			success: true,
			message: 'Photo de profil mise à jour avec succès',
		}
	})

// Update user info action
export const updateUserInfoAction = authenticatedActionClient
	.inputSchema(updateUserInfoSchema)
	.metadata({ actionName: 'updateUserInfoAction' })
	.action(async ({ parsedInput, ctx }) => {
		const response = await UserService.updateMe(parsedInput, ctx.token)

		return {
			success: true,
			message: 'Informations mises à jour avec succès',
			data: response,
		}
	})

// Update email action (sends verification code)
export const updateEmailAction = authenticatedActionClient
	.inputSchema(updateEmailSchema)
	.metadata({ actionName: 'updateEmailAction' })
	.action(async ({ parsedInput, ctx }) => {
		const response = await UserService.updateEmail(parsedInput, ctx.token)

		return {
			success: true,
			data: response,
			message: 'Code de vérification envoyé à votre nouvelle adresse e-mail',
		}
	})

// Verify email change action
export const verifyEmailChangeAction = authenticatedActionClient
	.inputSchema(verifyEmailChangeSchema)
	.metadata({ actionName: 'verifyEmailChangeAction' })
	.action(async ({ parsedInput, ctx }) => {
		const response = await UserService.verifyNewEmail(parsedInput.verificationCode, ctx.token)

		return {
			success: true,
			data: response,
			message: 'Adresse e-mail mise à jour avec succès',
		}
	})

// Resend email verification action
export const resendEmailVerificationAction = authenticatedActionClient
	.inputSchema(updateEmailSchema.pick({ email: true }))
	.metadata({ actionName: 'resendEmailVerificationAction' })
	.action(async ({ parsedInput }) => {
		// TODO: Implement resend verification code logic

		console.log('Resending verification code to:', parsedInput.email)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))

		return {
			success: true,
			message: 'Code de vérification renvoyé',
		}
	})

// Update password action
export const updatePasswordAction = authenticatedActionClient
	.inputSchema(updatePasswordSchema)
	.metadata({ actionName: 'updatePasswordAction' })
	.action(async ({ parsedInput }) => {
		// TODO: Implement password update logic
		// This should:
		// 1. Verify current password
		// 2. Hash new password
		// 3. Update password in database
		// 4. Optionally invalidate all user sessions except current one

		console.log('Updating password for user', parsedInput)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))

		return {
			success: true,
			message: 'Mot de passe mis à jour avec succès',
		}
	})

// Delete account action
export const deleteAccountAction = authenticatedActionClient
	.inputSchema(deleteAccountSchema)
	.metadata({ actionName: 'deleteAccountAction' })
	.action(async ({ parsedInput }) => {
		// TODO: Implement account deletion logic
		// This should:
		// 1. Verify password
		// 2. Soft delete or hard delete user account
		// 3. Delete/anonymize all user data
		// 4. Clear all sessions
		// 5. Send confirmation email

		console.log('Deleting account', parsedInput)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000))

		// Clear auth cookies and redirect
		// cookieStore.delete(AUTH_COOKIE_NAME)
		redirect('/auth/login?message=account-deleted')

		return {
			success: true,
			message: 'Votre compte a été supprimé avec succès',
		}
	})
