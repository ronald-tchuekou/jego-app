'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { DEFAULT_COMPANY_IMAGE } from '@/lib/constants'
import env from '@/lib/env/client'
import { cn, formatDate } from '@/lib/utils'
import { CompanyModel } from '@/services/company-service'
import { CircleIcon } from 'lucide-react'
import CompanyActions from './company-item-actions'
import CompanyVerificationStatus from './company-verification-status'

type Props = {
   company: CompanyModel
}

const CompanyItem = ({ company }: Props) => {
   const initials = company.name.charAt(0).toUpperCase()
   const companyLogo = company?.logo ? `${env.NEXT_PUBLIC_API_URL}/v1/${company?.logo}` : DEFAULT_COMPANY_IMAGE

   return (
      <TableRow>
         <TableCell>
            <div className='flex items-center space-x-3'>
               <Avatar className='size-10'>
                  <AvatarImage src={companyLogo} alt={company.name} />
                  <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
               </Avatar>
               <div className='flex flex-col'>
                  <span className='font-medium'>{company.name}</span>
                  <span className='text-sm text-muted-foreground'>{company.email || '- - -'}</span>
               </div>
            </div>
         </TableCell>
         <TableCell>{company.phone || '- - -'}</TableCell>
         <TableCell>{company.city || '- - -'}</TableCell>
         <TableCell>
            <Badge variant={'outline'}>{company.category?.name || '- - -'}</Badge>
         </TableCell>
         <TableCell>
            <div className='flex items-center gap-1'>
               <CompanyVerificationStatus company={company} />
            </div>
         </TableCell>
         <TableCell>
            <div className='flex items-center gap-1'>
               <CircleIcon
                  className={cn('size-2 fill-destructive stroke-0 text-destructive', {
                     'fill-green-500 stroke-0 text-green-500': !company.blockedAt,
                  })}
               />
               <span
                  className={cn('text-sm text-destructive', {
                     'text-green-600': !company.blockedAt,
                  })}
               >
                  {company.blockedAt ? 'Bloquée' : 'Active'}
               </span>
            </div>
         </TableCell>
         <TableCell>{formatDate(company.createdAt)}</TableCell>
         <TableCell>
            <CompanyActions company={company} />
         </TableCell>
      </TableRow>
   )
}

export default CompanyItem
