import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import { getAuth } from '@/lib/helpers/auth-helper'
import { UserRole } from '@/services/user-service'
import '@/styles/style.css'
import { Building2Icon, NotebookTextIcon, UsersIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function SettingsLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   const auth = await getAuth()

   if (!auth) {
      return redirect('/auth/login')
   }

   const routes =
      auth.user.role === UserRole.ADMIN
         ? [
              {
                 label: 'Catégories',
                 link: '/settings/categories',
                 icon: <NotebookTextIcon className='size-4' />,
              },
           ]
         : [
              {
                 label: 'Info entreprise',
                 link: '/settings/company-info',
                 icon: <Building2Icon className='size-4' />,
              },
           ]

   return (
      <>
         <DashboardTitle title='Paramètres' />
         <div className='space-y-3'>
            <DashboardTabs
               index={2}
               content={[
                  ...routes,
                  {
                     label: 'Membres',
                     link: '/settings/members',
                     icon: <UsersIcon className='size-4' />,
                  },
               ]}
            />
            {children}
         </div>
      </>
   )
}
