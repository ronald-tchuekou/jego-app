'use server'

import { authenticatedActionClient } from '@/lib/safe-action'

export const revalidateUserAction = authenticatedActionClient
   .metadata({ actionName: 'revalidateUserAction' })
   .action(async ({ ctx }) => {
      return {
         ...ctx,
      }
   })
