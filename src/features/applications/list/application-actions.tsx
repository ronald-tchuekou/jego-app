'use client'

import { Button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { JobApplicationModel, JobApplicationStatus } from '@/services/job-application-service'
import { CheckCircle, Eye, FileText, MoreHorizontal, Trash2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import { toast } from 'sonner'
import AlertDialogDeleteApplication, {
   AlertDialogDeleteApplicationRef,
} from '../components/alert-dialog-delete-application'
import AlertDialogUpdateApplicationStatus, {
   AlertDialogUpdateApplicationStatusRef,
} from '../components/alert-dialog-update-status-application'

type Props = {
   application: JobApplicationModel
}

const ApplicationActions = ({ application }: Props) => {
   const deleteDialogRef = useRef<AlertDialogDeleteApplicationRef>(null)
   const updateStatusDialogRef = useRef<AlertDialogUpdateApplicationStatusRef>(null)

   const handleViewResume = () => {
      if (application.resumePath) {
         window.open(application.resumePath, '_blank')
      } else {
         toast.error('Aucun CV disponible pour cette candidature')
      }
   }

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Ouvrir le menu</span>
                  <MoreHorizontal className='h-4 w-4' />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
               <DropdownMenuLabel>Actions</DropdownMenuLabel>
               <DropdownMenuSeparator />

               <DropdownMenuItem asChild>
                  <Link href={`/applications/${application.id}`}>
                     <Eye className='mr-2 h-4 w-4' />
                     Voir les détails
                  </Link>
               </DropdownMenuItem>

               {application.resumePath && (
                  <DropdownMenuItem onClick={handleViewResume}>
                     <FileText className='mr-2 h-4 w-4' />
                     Voir le CV
                  </DropdownMenuItem>
               )}

               <DropdownMenuSeparator />

               {application.status !== JobApplicationStatus.ACCEPTED && (
                  <DropdownMenuItem
                     onClick={() => updateStatusDialogRef.current?.open(application, JobApplicationStatus.ACCEPTED)}
                  >
                     <CheckCircle className='mr-2 h-4 w-4 text-green-600' />
                     Accepter
                  </DropdownMenuItem>
               )}

               {application.status !== JobApplicationStatus.REJECTED && (
                  <DropdownMenuItem
                     onClick={() => updateStatusDialogRef.current?.open(application, JobApplicationStatus.REJECTED)}
                  >
                     <XCircle className='mr-2 h-4 w-4 text-red-600' />
                     Rejeter
                  </DropdownMenuItem>
               )}

               {application.status !== JobApplicationStatus.PENDING && (
                  <DropdownMenuItem
                     onClick={() => updateStatusDialogRef.current?.open(application, JobApplicationStatus.PENDING)}
                  >
                     <Eye className='mr-2 h-4 w-4 text-yellow-600' />
                     Mettre en attente
                  </DropdownMenuItem>
               )}

               <DropdownMenuSeparator />

               <DropdownMenuItem onClick={() => deleteDialogRef.current?.open(application)}>
                  <Trash2 className='mr-2 h-4 w-4 text-destructive' />
                  Supprimer
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

         <AlertDialogDeleteApplication ref={deleteDialogRef} />
         <AlertDialogUpdateApplicationStatus ref={updateStatusDialogRef} />
      </>
   )
}

export default ApplicationActions
