import { Button } from '@/components/ui/button'
import { JobApplicationModel, JobApplicationStatus } from '@/services/job-application-service'
import { CheckCircleIcon } from 'lucide-react'
import { useRef } from 'react'
import AlertDialogUpdateApplicationStatus, {
   AlertDialogUpdateApplicationStatusRef,
} from '../components/alert-dialog-update-status-application'

type Props = {
   application: JobApplicationModel
}

const AcceptButton = ({ application }: Props) => {
   const ref = useRef<AlertDialogUpdateApplicationStatusRef>(null)

   return (
      <>
         <Button
            variant='outline'
            size='sm'
            onClick={() => ref.current?.open(application, JobApplicationStatus.ACCEPTED)}
         >
            <CheckCircleIcon className='text-teal-500' />
            Accepter
         </Button>
         <AlertDialogUpdateApplicationStatus ref={ref} />
      </>
   )
}

export default AcceptButton
