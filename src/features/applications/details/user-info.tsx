import UserAvatar from '@/components/base/user-avatar'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { JobApplicationModel, JobApplicationStatus } from '@/services/job-application-service'
import { Download, Mail, MapPinIcon, Phone, User } from 'lucide-react'
import JobApplicationStatusLabel from '../components/job-application-status-label'
import AcceptButton from './accept-button'
import PendingButton from './pending-button'
import RejectButton from './reject-button'

type Props = {
   application: JobApplicationModel
}

const UserInfo = ({ application }: Props) => {
   return (
      <Card>
         <CardHeader>
            <CardTitle className='flex items-center gap-2'>
               <User className='size-8' />
               Informations du candidat
            </CardTitle>
            <CardAction>
               <JobApplicationStatusLabel status={application.status} />
            </CardAction>
         </CardHeader>
         <CardContent className='space-y-4'>
            <UserAvatar user={application.user} className='size-20' />
            <p className='font-medium'>{application.user.displayName}</p>
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
               {application.user.address && (
                  <div className='flex items-center gap-2'>
                     <MapPinIcon className='size-4 text-muted-foreground' />
                     <span className='text-sm'>{application.user.address}</span>
                  </div>
               )}
               {application.user.city && (
                  <div className='flex items-center gap-2'>
                     <MapPinIcon className='size-4 text-muted-foreground' />
                     <span className='text-sm'>{application.user.city}</span>
                  </div>
               )}
               {application.user.country && (
                  <div className='flex items-center gap-2'>
                     <MapPinIcon className='size-4 text-muted-foreground' />
                     <span className='text-sm'>{application.user.country}</span>
                  </div>
               )}
            </div>
            {application.resumePath && (
               <>
                  <Separator />
                  <Button variant='outline' onClick={() => window.open(application.resumePath, '_blank')}>
                     <Download />
                     Télécharger le CV
                  </Button>
               </>
            )}
            <Separator />
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
            <div className='flex gap-2'>
               {application.status !== JobApplicationStatus.ACCEPTED && <AcceptButton application={application} />}
               {application.status !== JobApplicationStatus.REJECTED && <RejectButton application={application} />}
               {application.status !== JobApplicationStatus.PENDING && <PendingButton application={application} />}
            </div>
         </CardContent>
      </Card>
   )
}

export default UserInfo