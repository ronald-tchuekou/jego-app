'use server'

import env from '@/lib/env/client'
import serverEnv from '@/lib/env/server'
import { actionClient, authenticatedActionClient } from '@/lib/safe-action'
import PostService from '@/services/post-service'
import axios from 'axios'
import { createHash } from 'crypto'
import z from 'zod'
import { createPostFormSchema } from './schema'

export const deleteFileAction = actionClient
   .metadata({ actionName: 'deleteFileAction' })
   .inputSchema(
      z.object({
         filePath: z.string().min(1, "L'ID du fichier est requis"),
      }),
   )
   .action(async ({ parsedInput: { filePath } }) => {
      const response = await axios.delete(`${env.NEXT_PUBLIC_API_URL}/v1/files/revert?filePath=${filePath}`, {})
      const data =
         response.status === 200
            ? { success: true, message: 'Fichier supprimé avec succès' }
            : { success: false, message: 'Erreur lors de la suppression du fichier' }
      return data
   })

export const createPostFormAction = authenticatedActionClient
   .inputSchema(createPostFormSchema)
   .metadata({ actionName: 'createPostFormAction' })
   .action(async ({ parsedInput, ctx }) => {
      const post = await PostService.create({ ...parsedInput, status: 'published' }, ctx.token)

      return {
         success: true,
         message: 'Post créé avec succès',
         post,
      }
   })

// Action to update a post (author or admin only)
export const updatePostAction = authenticatedActionClient
   .metadata({ actionName: 'updatePostAction' })
   .inputSchema(
      z.object({
         postId: z.string().min(1, "L'ID du post est requis"),
         ...createPostFormSchema.shape,
      }),
   )
   .action(async ({ parsedInput: { postId, ...updateData }, ctx }) => {
      const post = await PostService.update(postId, updateData, ctx.token)
      return { success: true, message: 'Post modifié avec succès', post }
   })

// Generate Bunny TUS credentials (Create Video + presigned headers)
export const createBunnyTusCredentialsAction = actionClient
   .metadata({ actionName: 'createBunnyTusCredentialsAction' })
   .inputSchema(
      z.object({
         title: z.string().min(1).optional(),
         collection: z.string().optional(),
         thumbnailTime: z.number().optional(),
      }),
   )
   .action(async ({ parsedInput: { title, collection, thumbnailTime } }) => {
      const libraryId = Number(env.NEXT_PUBLIC_BUNNY_LIBRARY_ID)
      const apiKey = serverEnv.BUNNY_STREAM_API_KEY

      // 1) Create video to obtain VideoId (GUID)
      const createVideoUrl = `https://video.bunnycdn.com/library/${libraryId}/videos`
      const createRes = await axios.post(
         createVideoUrl,
         { title: title || 'Untitled' },
         { headers: { AccessKey: apiKey, 'Content-Type': 'application/json' } },
      )

      const videoId = createRes.data?.guid || createRes.data?.videoId || createRes.data?.id
      if (!videoId) {
         throw new Error('Impossible de créer la vidéo Bunny (VideoId manquant)')
      }

      // 2) Generate presigned AuthorizationSignature
      const expire = Math.floor(Date.now() / 1000) + 60 * 60 // 1h
      const signaturePayload = `${libraryId}${apiKey}${expire}${videoId}`
      const signature = createHash('sha256').update(signaturePayload).digest('hex')

      return {
         success: true,
         credentials: {
            libraryId,
            videoId,
            signature,
            expire,
            title: title || undefined,
            collection: collection || undefined,
            thumbnailTime: typeof thumbnailTime === 'number' ? thumbnailTime : undefined,
         },
      }
   })
