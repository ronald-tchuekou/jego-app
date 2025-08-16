import SearchInput from '@/components/base/search-input'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import '@/styles/style.css'
import { NotebookTextIcon, UsersIcon } from 'lucide-react'

export default async function SettingsLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <>
         <DashboardTitle title='Paramètres'>
            <SearchInput />
         </DashboardTitle>
         <div className='space-y-3'>
            <DashboardTabs
               index={2}
               content={[
                  {
                     label: 'Catégories',
                     link: '/settings/categories',
                     icon: <NotebookTextIcon className='size-4' />,
                  },
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
