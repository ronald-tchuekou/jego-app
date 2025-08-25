'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { DEFAULT_COMPANY_IMAGE } from '@/lib/constants'
import env from '@/lib/env/client'
import { formatDate } from '@/lib/utils'
import { JobModel, JobStatus } from '@/services/job-service'
import { Building, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import JobItemActions from './job-item-actions'

type Props = {
   job: JobModel
}

const JobItem = ({ job }: Props) => {
   const getStatusColor = (status: JobStatus) => {
      switch (status) {
         case JobStatus.OPEN:
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
         case JobStatus.CLOSED:
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
         default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      }
   }

   const isExpired = job.expiresAt && new Date(job.expiresAt) < new Date()

   return (
      <Card className='h-full hover:shadow-md transition-shadow duration-200 p-0'>
         <CardContent className='p-4 h-full flex flex-col relative'>
            <Link href={`/jobs/${job.id}`} className='block space-y-3 flex-1 group'>
               {/* Job Title */}
               <div className='space-y-2'>
                  <h3 className='text-lg font-semibold line-clamp-2 leading-tight group-hover:text-primary'>
                     {job.title}
                  </h3>
                  <p className='text-sm text-muted-foreground line-clamp-3'>{job.description}</p>
               </div>

               {/* Company Info */}
               <div className='flex items-center gap-2'>
                  <Avatar className='size-10'>
                     <AvatarImage
                        src={`${
                           job.companyLogo ? `${env.NEXT_PUBLIC_API_URL}/v1/${job.companyLogo}` : DEFAULT_COMPANY_IMAGE
                        }`}
                        alt={job.companyName || ''}
                     />
                     <AvatarFallback className='text-xs font-bold'>
                        {job.companyName?.substring(0, 2).toUpperCase()}
                     </AvatarFallback>
                  </Avatar>
                  <div>
                     {job.companyName && (
                        <div className='flex items-center gap-1 text-sm text-foreground'>
                           <Building className='size-3 flex-none' />
                           <span className='line-clamp-1'>{job.companyName}</span>
                        </div>
                     )}
                     {/* Location */}
                     {(job.companyCity || job.companyState) && (
                        <div className='flex items-center gap-1 text-sm text-foreground'>
                           <MapPin className='size-3 flex-none' />
                           <span className='line-clamp-1'>
                              {[job.companyCity, job.companyState].filter(Boolean).join(', ')}
                           </span>
                        </div>
                     )}
                  </div>
               </div>

               {/* Status and Expiry */}
               <div className='space-y-2'>
                  <div className='flex flex-wrap gap-2'>
                     <Badge className={getStatusColor(job.status)}>
                        {job.status === JobStatus.OPEN ? 'Ouvert' : 'Fermé'}
                     </Badge>
                     {isExpired && <Badge variant='destructive'>Expiré</Badge>}
                  </div>

                  {job.expiresAt && !isExpired && (
                     <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Calendar className='size-3 flex-none' />
                        <span>Expire le {formatDate(job.expiresAt)}</span>
                     </div>
                  )}

                  {/* Posted by and date */}
                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                     <p className='line-clamp-1 w-full'>
                        Par <span className='font-bold'>{job.user?.displayName || 'Anonyme'}</span>
                     </p>
                     <p className='text-xs flex-none'>{formatDate(job.createdAt)}</p>
                  </div>
               </div>
            </Link>

            {/* Actions */}
            <div className='absolute top-2 right-2'>
               <JobItemActions job={job} />
            </div>
         </CardContent>
      </Card>
   )
}

export default JobItem
