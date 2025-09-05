'use client'

import { UserRole } from '@/services/user-service'
import { useAuth } from '../providers/auth'

export default function ContentGuard({ children, roles }: { children: React.ReactNode; roles: UserRole[] }) {
   const { auth } = useAuth()
   const role = auth?.user?.role

   if (!role || (role && !roles.includes(role))) return null

   return children
}
