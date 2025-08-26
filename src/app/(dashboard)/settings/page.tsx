import { getAuth } from '@/lib/helpers/auth-helper'
import { UserRole } from '@/services/user-service'
import { redirect } from 'next/navigation'

export default async function Page() {
   const auth = await getAuth()

   if (!auth) {
      return redirect('/auth/login')
   }

   return redirect(`/settings/${auth.user.role === UserRole.ADMIN ? 'categories' : 'company-info'}`)
}
