import { AUTH_COOKIE_NAME } from '@/lib/constants'
import { Auth } from '@/services/auth-service'
import { cookies } from 'next/headers'

export async function getAuth() {
   const cookieStore = await cookies()
   const authKey = cookieStore.get(AUTH_COOKIE_NAME)?.value
   const auth = authKey ? (JSON.parse(authKey) as Auth) : null
   return auth
}
