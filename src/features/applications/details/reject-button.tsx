import { Button } from '@/components/ui/button'
import { JobApplicationModel, JobApplicationStatus } from '@/services/job-application-service'
import { XCircleIcon } from 'lucide-react'
import { useRef } from 'react'
import AlertDialogUpdateApplicationStatus, {
   AlertDialogUpdateApplicationStatusRef,
} from '../components/alert-dialog-update-status-application'

type Props = {
   application: JobApplicationModel
}

const RejectButton = ({ application }: Props) => {
   const ref = useRef<AlertDialogUpdateApplicationStatusRef>(null)

   return (
      <>
         <Button
            variant='outline'
            size='sm'
            onClick={() => ref.current?.open(application, JobApplicationStatus.REJECTED)}
         >
            <XCircleIcon className='text-destructive' />
            Rejeter
         </Button>
         <AlertDialogUpdateApplicationStatus ref={ref} />
      </>
   )
}

export default RejectButton
