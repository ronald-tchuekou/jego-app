'use client'

import { UserRole } from '@/services/user-service'
import { useAuth } from '../providers/auth'

export default function ContentGuard({ children, role }: { children: React.ReactNode; role: UserRole }) {
   const { auth } = useAuth()

   if (auth?.user?.role !== role) return null

   return children
}
