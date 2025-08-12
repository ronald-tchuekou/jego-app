import { createEnv } from '@t3-oss/env-nextjs';
import z from 'zod'

const env = createEnv({
	client: {
		NEXT_PUBLIC_API_URL: z.url().min(1),
		NEXT_PUBLIC_APP_URL: z.url().min(1),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
	},
})

export default env;
