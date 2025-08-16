'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

type Props = {
   content: DashboardTabType[]
   index: number
}

export const DashboardTabs: FC<Props> = ({ content, index }) => {
   const currentPath = usePathname()

   const isActive = (url: string) => {
      const path = currentPath.split('/')[index]
      return path === url.split('/')[index]
   }

   return (
      <div className={cn('flex gap-2', 'bg-card border rounded-xl p-1')}>
         {content.map((tab, index) => (
            <Button
               key={`tab-${index}`}
               variant={'ghost'}
               className={cn('font-medium rounded-md', {
                  'bg-primary/10 text-primary': isActive(tab.link),
                  'hover:bg-primary/15 hover:text-primary': isActive(tab.link),
               })}
               asChild
            >
               <Link href={tab.link} key={index}>
                  {tab.icon}
                  <span>{tab.label}</span>
               </Link>
            </Button>
         ))}
      </div>
   )
}
