'use client'

import UserAvatar from '@/components/base/user-avatar'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { JobApplicationModel } from '@/services/job-application-service'
import JobApplicationStatusLabel from '../components/job-application-status-label'
import ApplicationActions from './application-actions'

type Props = {
   application: JobApplicationModel
}

const ApplicationItem = ({ application }: Props) => {
   return (
      <TableRow>
         <TableCell>
            <div className='flex items-center space-x-3'>
               <UserAvatar user={application.user} className='size-10' />
               <div className='flex flex-col'>
                  <span className='font-medium'>{application.user.displayName}</span>
                  <span className='text-sm text-muted-foreground'>{application.user.email}</span>
               </div>
            </div>
         </TableCell>
         <TableCell className='whitespace-normal'>
            <div className='flex flex-col'>
               <span className='font-medium line-clamp-1'>{application.job.title}</span>
               <span className='text-sm text-muted-foreground'>{application.job.description.substring(0, 50)}...</span>
            </div>
         </TableCell>
         <TableCell>
            <JobApplicationStatusLabel status={application.status} />
         </TableCell>
         <TableCell>
            <span className='text-sm text-muted-foreground'>{formatDate(application.createdAt)}</span>
         </TableCell>
         <TableCell>
            <span className='text-sm text-muted-foreground'>{formatDate(application.updatedAt)}</span>
         </TableCell>
         <TableCell>
            <ApplicationActions application={application} />
         </TableCell>
      </TableRow>
   )
}

export default ApplicationItem
