'use client'

import SearchInput from '@/components/base/search-input'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const DynamicJobStatusFilter = dynamic(() => import('@/features/jobs/list/job-status-filter'))
const DynamicJobsList = dynamic(() => import('@/features/jobs/list/jobs-list'))

export default function JobsPage() {
   return (
      <>
         {/* Title */}
         <DashboardTitle
            title={"Gestion des offres d'emploi"}
            description="Gérez et consultez toutes les offres d'emploi"
         >
            <Button asChild>
               <Link href='/jobs/edit'>
                  <PlusIcon className='size-4' />
                  <span className='hidden sm:block'>Créer une offre d&apos;emploi</span>
               </Link>
            </Button>
         </DashboardTitle>
         {/* Filters Section */}
         <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
            <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center flex-1'>
               <SearchInput />
               <DynamicJobStatusFilter />
            </div>
         </div>
         {/* Jobs List */}
         <DynamicJobsList />
      </>
   )
}
