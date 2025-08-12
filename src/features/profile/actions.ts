'use server'

import { AUTH_COOKIE_NAME } from '@/lib/constants'
import fetchHelper from '@/lib/helpers/fetch-helper'
import { authenticatedActionClient } from '@/lib/safe-action'
import UserService, { UserModel } from '@/services/user-service'
import { cookies } from 'next/headers'
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

		const { data, error } = await fetchHelper<{ user: UserModel }>('/me/image-profile', {
			method: 'POST',
			body: formData,
			headers: {
				Authorization: `Bearer ${ctx.token}`,
			},
		})

		if (error) throw new Error(error)

		if (!data?.user) {
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
		const data = await UserService.updateMe(parsedInput, ctx.token)

		return {
			success: true,
			message: 'Informations mises à jour avec succès',
			data,
		}
	})

// Update email action (sends verification code)
export const updateEmailAction = authenticatedActionClient
	.inputSchema(updateEmailSchema)
	.metadata({ actionName: 'updateEmailAction' })
	.action(async ({ parsedInput, ctx }) => {
		const data = await UserService.updateMeEmail(parsedInput, ctx.token)

		return {
			success: true,
			data,
			message: 'Code de vérification envoyé à votre nouvelle adresse e-mail',
		}
	})

// Verify email change action
export const verifyEmailChangeAction = authenticatedActionClient
	.inputSchema(verifyEmailChangeSchema)
	.metadata({ actionName: 'verifyEmailChangeAction' })
	.action(async ({ parsedInput, ctx }) => {
		const data = await UserService.verifyNewEmail(parsedInput.verificationCode, ctx.token)

		return {
			success: true,
			data,
			message: 'Adresse e-mail mise à jour avec succès',
		}
	})

// Resend email verification action
export const resendEmailVerificationAction = authenticatedActionClient
	.metadata({ actionName: 'resendEmailVerificationAction' })
	.action(async ({ ctx }) => {
		const data = await UserService.resendMeEmailVerification(ctx.token)

		return {
			success: true,
			data,
			message: 'Code de vérification renvoyé',
		}
	})

// Update password action
export const updatePasswordAction = authenticatedActionClient
	.inputSchema(updatePasswordSchema)
	.metadata({ actionName: 'updatePasswordAction' })
	.action(async ({ parsedInput, ctx }) => {
		const data = await UserService.updateMePassword(parsedInput, ctx.token)

		return {
			success: true,
			data,
			message: 'Mot de passe mis à jour avec succès',
		}
	})

// Delete account action
export const deleteAccountAction = authenticatedActionClient
	.inputSchema(deleteAccountSchema)
	.metadata({ actionName: 'deleteAccountAction' })
	.action(async ({ parsedInput, ctx }) => {
		const data = await UserService.deleteMe(parsedInput, ctx.token)

		const cookieStore = await cookies()
		cookieStore.delete(AUTH_COOKIE_NAME)

		return {
			success: true,
			data,
			message: 'Votre compte a été supprimé avec succès',
		}
	})
