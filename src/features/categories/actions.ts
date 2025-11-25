'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import { getSlug } from '@/lib/utils'
import CategoryService from '@/services/category-service'
import { z } from 'zod'

export const deleteCategoryAction = authenticatedActionClient
   .metadata({ actionName: 'delete-category' })
   .inputSchema(z.string())
   .action(async ({ parsedInput, ctx }) => {
      return CategoryService.deleteOne(parsedInput, ctx.token)
   })

export const createCategoryAction = authenticatedActionClient
   .metadata({ actionName: 'create-category' })
   .inputSchema(
      z.object({
         name: z.string(),
         description: z.string().optional(),
      }),
   )
   .action(async ({ parsedInput, ctx }) => {
      const body = {
         ...parsedInput,
         description: parsedInput.description || null,
         slug: getSlug(parsedInput.name),
      }
      return CategoryService.createOne(body, ctx.token)
   })

export const updateCategoryAction = authenticatedActionClient
   .metadata({ actionName: 'update-category' })
   .inputSchema(
      z.object({
         id: z.string(),
         name: z.string().optional(),
         description: z.string().optional(),
      }),
   )
   .action(async ({ parsedInput, ctx }) => {
      const body = {
         ...parsedInput,
         description: parsedInput.description || null,
         slug: getSlug(parsedInput.name || ''),
      }
      return CategoryService.updateOne(parsedInput.id, body, ctx.token)
   })
