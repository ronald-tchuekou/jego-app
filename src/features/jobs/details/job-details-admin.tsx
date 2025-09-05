'use client'

import UserAvatar from '@/components/base/user-avatar'
import ViewAsMarkdown from '@/components/base/view-as-markdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DEFAULT_COMPANY_IMAGE } from '@/lib/constants'
import env from '@/lib/env/client'
import { formatDate } from '@/lib/utils'
import { JobModel, JobStatus } from '@/services/job-service'
import {
   Building,
   Calendar,
   EditIcon,
   Globe,
   LockIcon,
   Mail,
   MapPin,
   Phone,
   Trash2Icon,
   UnlockIcon,
   User,
} from 'lucide-react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { DeleteJobDialog, ToggleJobStatusDialog } from '../list/job-item-actions'

type JobProps = {
   job: JobModel
}

export function JobDetailsAdmin({ job }: JobProps) {
   const router = useRouter()
   const deleteJobModalRef = useRef<{ open: VoidFunction }>(null)
   const toggleStatusModalRef = useRef<{ open: VoidFunction }>(null)

   const getRoleColor = (role: string) => {
      switch (role) {
         case 'admin':
            return 'text-red-600 dark:text-red-400'
         case 'company:admin':
            return 'text-blue-600 dark:text-blue-400'
         case 'company:agent':
            return 'text-green-600 dark:text-green-400'
         default:
            return 'text-muted-foreground'
      }
   }

   const formatRole = (role: string) => {
      switch (role) {
         case 'admin':
            return 'Administrateur'
         case 'company:admin':
            return 'Admin Entreprise'
         case 'company:agent':
            return 'Agent Entreprise'
         case 'user':
            return 'Utilisateur'
         default:
            return role
      }
   }

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
      <>
         <div className='w-full max-w-7xl'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
               {/* Header Section */}
               <Card className='lg:col-span-2'>
                  <CardHeader>
                     <div className='flex flex-col gap-4'>
                        <div className='flex items-center justify-between'>
                           <div className='flex flex-wrap items-center gap-2'>
                              <Badge className={getStatusColor(job.status)}>
                                 {job.status === JobStatus.OPEN ? 'Ouvert' : 'Fermé'}
                              </Badge>
                              {isExpired && <Badge variant='destructive'>Expiré</Badge>}
                           </div>
                           <div className='flex items-center gap-1'>
                              <Button
                                 size={'icon-sm'}
                                 variant={'secondary'}
                                 onClick={() => deleteJobModalRef.current?.open()}
                              >
                                 <Trash2Icon />
                              </Button>
                              <Button
                                 size={'icon-sm'}
                                 variant={'outline'}
                                 onClick={() => toggleStatusModalRef.current?.open()}
                              >
                                 {job.status === JobStatus.OPEN ? <LockIcon /> : <UnlockIcon />}
                              </Button>
                              <Button size={'icon-sm'} variant={'outline'} asChild>
                                 <Link href={`/jobs/edit/${job.id}`}>
                                    <EditIcon />
                                 </Link>
                              </Button>
                           </div>
                        </div>
                        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight'>{job.title}</h1>
                     </div>

                     {/* Meta Information */}
                     <div className='flex flex-wrap gap-4 text-sm text-muted-foreground whitespace-nowrap'>
                        <div className='flex items-center gap-2'>
                           <User className='size-4' />
                           <span>{job.user?.displayName || 'Anonyme'}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                           <Calendar className='size-4' />
                           <span>Créé le {formatDate(job.createdAt)}</span>
                        </div>
                        {DateTime.fromISO(job.updatedAt).startOf('day') >
                           DateTime.fromISO(job.createdAt).startOf('day') && (
                           <div className='flex items-center gap-2 sm:col-span-2'>
                              <Calendar className='size-4' />
                              <span>Dernière modification le {formatDate(job.updatedAt)}</span>
                           </div>
                        )}
                        {job.expiresAt && (
                           <div className='flex items-center gap-2'>
                              <Calendar className='size-4' />
                              <span>Expire le {formatDate(job.expiresAt)}</span>
                           </div>
                        )}
                     </div>
                  </CardHeader>

                  {/* Content Section */}
                  <CardContent>
                     <ViewAsMarkdown markdown={job.description} />
                  </CardContent>

                  {/* Company Information */}
                  {(job.companyName ||
                     job.companyWebsite ||
                     job.companyEmail ||
                     job.companyPhone ||
                     job.companyAddress ||
                     job.companyLogo) && (
                     <CardContent className='pt-0'>
                        <Separator className='mb-4' />
                        <h3 className='text-lg font-semibold mb-4'>Informations sur l&apos;entreprise</h3>
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
                        <div className='space-y-3'>
                           {job.companyName && (
                              <div className='flex items-center gap-3'>
                                 <Building className='h-4 w-4 text-muted-foreground' />
                                 <span>{job.companyName}</span>
                              </div>
                           )}

                           {(job.companyAddress || job.companyCity || job.companyState || job.companyCountry) && (
                              <div className='flex items-start gap-3'>
                                 <MapPin className='h-4 w-4 text-muted-foreground mt-0.5' />
                                 <div className='space-y-1 text-sm'>
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
                                 <Globe className='h-4 w-4 text-muted-foreground' />
                                 <a
                                    href={
                                       job.companyWebsite.startsWith('http')
                                          ? job.companyWebsite
                                          : `https://${job.companyWebsite}`
                                    }
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary hover:underline text-sm'
                                 >
                                    {job.companyWebsite}
                                 </a>
                              </div>
                           )}

                           {job.companyEmail && (
                              <div className='flex items-center gap-3'>
                                 <Mail className='h-4 w-4 text-muted-foreground' />
                                 <a
                                    href={`mailto:${job.companyEmail}`}
                                    className='text-primary hover:underline text-sm'
                                 >
                                    {job.companyEmail}
                                 </a>
                              </div>
                           )}

                           {job.companyPhone && (
                              <div className='flex items-center gap-3'>
                                 <Phone className='h-4 w-4 text-muted-foreground' />
                                 <a href={`tel:${job.companyPhone}`} className='text-primary hover:underline text-sm'>
                                    {job.companyPhone}
                                 </a>
                              </div>
                           )}
                        </div>
                     </CardContent>
                  )}
               </Card>

               {/* Admin Sidebar */}
               <div className='space-y-6'>
                  {/* Author Information */}
                  <Card>
                     <CardHeader>
                        <CardTitle className='text-lg'>Informations Auteur</CardTitle>
                     </CardHeader>
                     <CardContent className='space-y-4'>
                        <div className='flex items-start gap-3'>
                           <UserAvatar user={job.user} className='size-12' />
                           <div className='flex-1 min-w-0'>
                              <h4 className='font-medium truncate'>{job.user.displayName}</h4>
                              <p className='text-sm truncate text-muted-foreground'>{job.user.email}</p>
                           </div>
                        </div>

                        <Separator />

                        <div className='space-y-3 text-sm'>
                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>Rôle:</span>
                              <span className={`font-medium ${getRoleColor(job.user.role)} text-right`}>
                                 {formatRole(job.user.role)}
                              </span>
                           </div>

                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>ID Utilisateur:</span>
                              <span className='font-mono text-xs text-right'>{job.user.id}</span>
                           </div>

                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>Inscription:</span>
                              <span className='text-right'>{formatDate(job.user.createdAt)}</span>
                           </div>

                           {job.user.lastLoginAt && (
                              <div className='flex justify-between'>
                                 <span className='text-muted-foreground'>Dernière connexion:</span>
                                 <span className='text-right'>{formatDate(job.user.lastLoginAt)}</span>
                              </div>
                           )}

                           {job.user.blockedAt && (
                              <>
                                 <Separator />
                                 <div className='flex justify-between text-red-600 dark:text-red-400'>
                                    <span>Bloqué le:</span>
                                    <span className='text-right'>{formatDate(job.user.blockedAt)}</span>
                                 </div>
                              </>
                           )}
                        </div>
                     </CardContent>
                  </Card>

                  {/* Job Metadata */}
                  <Card>
                     <CardHeader>
                        <CardTitle className='text-lg'>Métadonnées</CardTitle>
                     </CardHeader>
                     <CardContent className='space-y-3 text-sm'>
                        <div className='flex justify-between'>
                           <span className='text-muted-foreground'>ID Job:</span>
                           <span className='font-mono text-xs text-right'>{job.id}</span>
                        </div>

                        <div className='flex justify-between'>
                           <span className='text-muted-foreground'>Statut:</span>
                           <Badge className={`${getStatusColor(job.status)} text-xs`}>
                              {job.status === JobStatus.OPEN ? 'Ouvert' : 'Fermé'}
                           </Badge>
                        </div>

                        {job.expiresAt && (
                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>Expiration:</span>
                              <span className='text-right'>{formatDate(job.expiresAt)}</span>
                           </div>
                        )}

                        <Separator />

                        <div className='flex justify-between'>
                           <span className='text-muted-foreground'>Créé:</span>
                           <span className='text-right'>{formatDate(job.createdAt)}</span>
                        </div>

                        <div className='flex justify-between'>
                           <span className='text-muted-foreground'>Modifié:</span>
                           <span className='text-right'>{formatDate(job.updatedAt)}</span>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>

         <DeleteJobDialog
            ref={deleteJobModalRef}
            job={job}
            onCompleted={() => {
               router.back()
            }}
         />
         <ToggleJobStatusDialog ref={toggleStatusModalRef} job={job} />
      </>
   )
}
