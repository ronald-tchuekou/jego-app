"use server"

import { AUTH_COOKIE_NAME } from "@/lib/constants"
import { authenticatedActionClient } from "@/lib/safe-action"
import AuthService from "@/services/auth-service"
import { cookies } from "next/headers"

export const logoutAction = authenticatedActionClient.metadata({ actionName: 'logout' }).action(async ({ ctx }) => {
   await AuthService.logout(ctx.token)

   const cookieStore = await cookies()
   cookieStore.delete(AUTH_COOKIE_NAME)

   return { success: true }
})
