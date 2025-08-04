import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const env = createEnv({
	server: {
		API_URL: z.url().min(1),
		APP_URL: z.url().min(1),
		NODE_ENV: z.enum(['development', 'production']),
	},
	experimental__runtimeEnv: process.env,
})

export default env
