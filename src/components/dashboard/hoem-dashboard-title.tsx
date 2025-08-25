'use client'

import { UserRole } from '@/services/user-service'
import { useAuth } from '../providers/auth'
import { DashboardTitle } from './dashboard-title'

export default function HomeDashboardTitle() {
   const { auth } = useAuth()
   const user = auth?.user

   if (!user) return null

   return (
      <DashboardTitle
         title='Tableau de bord'
         description={
            user?.role === UserRole.ADMIN
               ? "Visibilité sur l'ensemble des opérations effectuées sur l'application."
               : user.role === UserRole.COMPANY_ADMIN
                 ? "Visibilité sur l'ensemble des opérations effectuées par votre entreprise."
                 : "Vu d'ensemble de tout vos opérations."
         }
      />
   )
}
