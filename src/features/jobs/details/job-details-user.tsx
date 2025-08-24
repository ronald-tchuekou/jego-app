'use client'

import ViewAsMarkdown from '@/components/base/view-as-markdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DEFAULT_AVATAR, DEFAULT_COMPANY_IMAGE } from '@/lib/constants'
import env from '@/lib/env/client'
import { formatDate } from '@/lib/utils'
import { JobModel, JobStatus } from '@/services/job-service'
import { Building, Calendar, Globe, Mail, MapPin, Phone, User } from 'lucide-react'
import { DateTime } from 'luxon'

type Props = {
   job: JobModel
}

export function JobDetailsUser({ job }: Props) {
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
      <div className='w-full max-w-7xl space-y-5'>
         {/* Header Section */}
         <Card>
            <CardHeader>
               <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                  <div className='flex-1 space-y-2'>
                     <div className='flex flex-wrap items-center gap-2'>
                        <Badge className={getStatusColor(job.status)}>
                           {job.status === JobStatus.OPEN ? 'Ouvert' : 'Fermé'}
                        </Badge>
                        {isExpired && <Badge variant='destructive'>Expiré</Badge>}
                     </div>
                     <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight'>{job.title}</h1>
                  </div>
               </div>

               {/* Meta Information */}
               <div className='flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                     <User className='h-4 w-4' />
                     <span>{job.user?.displayName || 'Anonyme'}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                     <Calendar className='h-4 w-4' />
                     <span>Publié le {formatDate(job.createdAt)}</span>
                  </div>
                  {DateTime.fromISO(job.updatedAt).startOf('day') > DateTime.fromISO(job.createdAt).startOf('day') && (
                     <div className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4' />
                        <span>Modifié le {formatDate(job.updatedAt)}</span>
                     </div>
                  )}
                  {job.expiresAt && !isExpired && (
                     <div className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4' />
                        <span>Expire le {formatDate(job.expiresAt)}</span>
                     </div>
                  )}
               </div>
            </CardHeader>

            {/* Job Description */}
            <CardContent>
               <ViewAsMarkdown markdown={job.description} />
            </CardContent>
         </Card>

         {/* Company Information */}
         {(job.companyName ||
            job.companyWebsite ||
            job.companyEmail ||
            job.companyPhone ||
            job.companyAddress ||
            job.companyLogo) && (
            <Card>
               <CardHeader>
                  <h3 className='text-lg font-semibold'>Informations sur l&apos;entreprise</h3>
               </CardHeader>
               <CardContent>
                  <div className='space-y-4'>
                     <Avatar className='size-20'>
                        <AvatarImage
                           src={`${
                              job.companyLogo
                                 ? `${env.NEXT_PUBLIC_API_URL}/v1/${job.companyLogo}`
                                 : DEFAULT_COMPANY_IMAGE
                           }`}
                           alt={job.companyName || ''}
                        />
                        <AvatarFallback className='text-xs font-bold'>
                           {job.companyName?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                     </Avatar>
                     {job.companyName && (
                        <div className='flex items-center gap-3'>
                           <Building className='h-5 w-5 text-muted-foreground' />
                           <span className='font-medium'>{job.companyName}</span>
                        </div>
                     )}

                     {(job.companyAddress || job.companyCity || job.companyState || job.companyCountry) && (
                        <div className='flex items-start gap-3'>
                           <MapPin className='h-5 w-5 text-muted-foreground mt-0.5' />
                           <div className='space-y-1'>
                              {job.companyAddress && <div>{job.companyAddress}</div>}
                              <div>
                                 {[job.companyCity, job.companyState, job.companyZip, job.companyCountry]
                                    .filter(Boolean)
                                    .join(', ')}
                              </div>
                           </div>
                        </div>
                     )}

                     {job.companyWebsite && (
                        <div className='flex items-center gap-3'>
                           <Globe className='h-5 w-5 text-muted-foreground' />
                           <a
                              href={
                                 job.companyWebsite.startsWith('http')
                                    ? job.companyWebsite
                                    : `https://${job.companyWebsite}`
                              }
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-primary hover:underline'
                           >
                              {job.companyWebsite}
                           </a>
                        </div>
                     )}

                     {job.companyEmail && (
                        <div className='flex items-center gap-3'>
                           <Mail className='h-5 w-5 text-muted-foreground' />
                           <a href={`mailto:${job.companyEmail}`} className='text-primary hover:underline'>
                              {job.companyEmail}
                           </a>
                        </div>
                     )}

                     {job.companyPhone && (
                        <div className='flex items-center gap-3'>
                           <Phone className='h-5 w-5 text-muted-foreground' />
                           <a href={`tel:${job.companyPhone}`} className='text-primary hover:underline'>
                              {job.companyPhone}
                           </a>
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>
         )}

         {/* Author Information */}
         <Card>
            <CardHeader>
               <h3 className='text-lg font-semibold'>À propos de l&apos;auteur</h3>
            </CardHeader>
            <CardContent>
               <div className='flex items-start gap-4'>
                  <Avatar className='size-12'>
                     <AvatarImage
                        src={
                           job.user.profileImage
                              ? `${process.env.NEXT_PUBLIC_API_URL}/v1/${job.user.profileImage}`
                              : DEFAULT_AVATAR
                        }
                     />
                     <AvatarFallback>{job.user.displayName?.charAt(0) || 'A'}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-0'>
                     <h4 className='font-medium'>{job.user.displayName || 'Anonyme'}</h4>
                     <p className='text-sm text-muted-foreground'>Membre depuis {formatDate(job.user.createdAt)}</p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   )
}
