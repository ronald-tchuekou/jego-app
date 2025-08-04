import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'

const actionClient = createSafeActionClient({
   defineMetadataSchema() {
      return z.object({
         actionName: z.string(),
      })
   },
})

export default actionClient
