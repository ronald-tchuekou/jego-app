'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import UserAvatar from '@/components/base/user-avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { applicationKey } from '@/lib/query-kye'
import { formatDate } from '@/lib/utils'
import { JobApplicationStatus } from '@/services/job-application-service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Briefcase, Building, Calendar, CheckCircle, Download, Mail, MapPin, Phone, User, XCircle } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getApplicationByIdAction, updateApplicationStatusAction } from '../actions'
import JobApplicationStatusLabel from '../components/job-application-status-label'

type Props = {
   applicationId: string
}

export default function ApplicationDetails({ applicationId }: Props) {
   const router = useRouter()
   const queryClient = useQueryClient()

   // Fetch application details
   const {
      data: application,
      isLoading,
      error,
   } = useQuery({
      queryKey: applicationKey.detail(applicationId),
      async queryFn({ queryKey }) {
         const applicationId = queryKey[2]
         const result = await getApplicationByIdAction({ applicationId })

         if (result?.serverError) {
            throw new Error(result.serverError)
         }

         if (result?.validationErrors) {
            throw new Error(
               result.validationErrors._errors?.join(', ') || 'Erreur lors du chargement de la candidature'
            )
         }

         return result?.data
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
   })

   // Mutation for updating application status
   const { execute: updateStatus, isPending: isUpdatingStatus } = useAction(updateApplicationStatusAction, {
      onSuccess: () => {
         toast.success('Statut de la candidature mis à jour avec succès')
         queryClient.invalidateQueries({ queryKey: applicationKey.detail(applicationId) })
         queryClient.invalidateQueries({ queryKey: applicationKey.lists() })
      },
      onError: ({ error }) => {
         toast.error(error.serverError)
      },
   })

   if (isLoading) {
      return <LoaderContent />
   }

   if (error || !application) {
      return (
         <EmptyContent
            text="Cette candidature n'existe pas"
            actionContent={
               <Button asChild className='mt-4'>
                  <Link href='/applications'>Retour aux candidatures</Link>
               </Button>
            }
         />
      )
   }

   return (
      <div className='space-y-6'>
         {/* Header Card */}
         <Card className='bg-card'>
            <CardHeader>
               <div className='flex justify-between items-start'>
                  <div>
                     <CardTitle className='text-2xl mb-2'>Détails de la candidature</CardTitle>
                     <CardDescription>Candidature #{application.id.slice(0, 8)}</CardDescription>
                  </div>
                  <div className='flex gap-2'>
                     <JobApplicationStatusLabel status={application.status} />
                  </div>
               </div>
            </CardHeader>
         </Card>

         <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Candidat Information */}
            <Card className='bg-card'>
               <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                     <User className='h-4 w-4' />
                     Informations du candidat
                  </CardTitle>
               </CardHeader>
               <CardContent className='space-y-4'>
                  <div className='flex items-center space-x-3'>
                     <UserAvatar user={application.user} className='size-12' />
                     <div>
                        <p className='font-medium'>{application.user.displayName}</p>
                        <p className='text-sm text-muted-foreground'>{application.user.role}</p>
                     </div>
                  </div>

                  <Separator />

                  <div className='space-y-3'>
                     <div className='flex items-center gap-2'>
                        <Mail className='h-4 w-4 text-muted-foreground' />
                        <span className='text-sm'>{application.user.email}</span>
                     </div>
                     {application.user.phone && (
                        <div className='flex items-center gap-2'>
                           <Phone className='h-4 w-4 text-muted-foreground' />
                           <span className='text-sm'>{application.user.phone}</span>
                        </div>
                     )}
                  </div>

                  {application.resumePath && (
                     <>
                        <Separator />
                        <Button
                           className='w-full'
                           variant='outline'
                           onClick={() => window.open(application.resumePath, '_blank')}
                        >
                           <Download className='mr-2 h-4 w-4' />
                           Télécharger le CV
                        </Button>
                     </>
                  )}
               </CardContent>
            </Card>

            {/* Job Information */}
            <Card className='bg-card'>
               <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                     <Briefcase className='h-4 w-4' />
                     Poste concerné
                  </CardTitle>
               </CardHeader>
               <CardContent className='space-y-4'>
                  <div>
                     <p className='font-medium text-lg'>{application.job.title}</p>
                     <p className='text-sm text-muted-foreground mt-1'>{application.job.description}</p>
                  </div>

                  <Separator />

                  <div className='space-y-3'>
                     <div className='flex items-center gap-2'>
                        <Building className='h-4 w-4 text-muted-foreground' />
                        <span className='text-sm'>{application.job.companyName}</span>
                     </div>
                     <div className='flex items-center gap-2'>
                        <MapPin className='h-4 w-4 text-muted-foreground' />
                        <span className='text-sm'>{application.job.companyAddress}</span>
                     </div>
                  </div>

                  <Separator />

                  <Button
                     className='w-full'
                     variant='outline'
                     onClick={() => router.push(`/jobs/${application.jobId}`)}
                  >
                     Voir le poste
                  </Button>
               </CardContent>
            </Card>

            {/* Dates & Actions */}
            <Card className='bg-card'>
               <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                     <Calendar className='h-4 w-4' />
                     Dates & Actions
                  </CardTitle>
               </CardHeader>
               <CardContent className='space-y-4'>
                  <div className='space-y-3'>
                     <div>
                        <p className='text-sm text-muted-foreground'>Date de candidature</p>
                        <p className='font-medium'>{formatDate(application.createdAt)}</p>
                     </div>
                     <div>
                        <p className='text-sm text-muted-foreground'>Dernière mise à jour</p>
                        <p className='font-medium'>{formatDate(application.updatedAt)}</p>
                     </div>
                  </div>

                  <Separator />

                  <div className='space-y-2'>
                     <p className='text-sm font-medium mb-3'>Modifier le statut</p>

                     {application.status !== JobApplicationStatus.ACCEPTED && (
                        <Button
                           className='w-full'
                           variant='outline'
                           onClick={() =>
                              updateStatus({ applicationId: application.id, status: JobApplicationStatus.ACCEPTED })
                           }
                           disabled={isUpdatingStatus}
                        >
                           <CheckCircle className='mr-2 h-4 w-4 text-green-600' />
                           Accepter la candidature
                        </Button>
                     )}

                     {application.status !== JobApplicationStatus.REJECTED && (
                        <Button
                           className='w-full'
                           variant='outline'
                           onClick={() =>
                              updateStatus({ applicationId: application.id, status: JobApplicationStatus.REJECTED })
                           }
                           disabled={isUpdatingStatus}
                        >
                           <XCircle className='mr-2 h-4 w-4 text-red-600' />
                           Rejeter la candidature
                        </Button>
                     )}

                     {application.status !== JobApplicationStatus.PENDING && (
                        <Button
                           className='w-full'
                           variant='outline'
                           onClick={() =>
                              updateStatus({ applicationId: application.id, status: JobApplicationStatus.PENDING })
                           }
                           disabled={isUpdatingStatus}
                        >
                           Mettre en attente
                        </Button>
                     )}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   )
}
