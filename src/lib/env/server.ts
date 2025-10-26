import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const env = createEnv({
   server: {
      NODE_ENV: z.enum(['development', 'production']),
      BUNNY_STREAM_API_KEY: z.string().min(1),
   },
   experimental__runtimeEnv: process.env,
})

export default env
