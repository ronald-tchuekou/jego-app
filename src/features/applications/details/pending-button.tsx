import { Button } from '@/components/ui/button'
import { JobApplicationModel, JobApplicationStatus } from '@/services/job-application-service'
import { ClockIcon } from 'lucide-react'
import { useRef } from 'react'
import AlertDialogUpdateApplicationStatus, {
   AlertDialogUpdateApplicationStatusRef,
} from '../components/alert-dialog-update-status-application'

type Props = {
   application: JobApplicationModel
}

const PendingButton = ({ application }: Props) => {
   const ref = useRef<AlertDialogUpdateApplicationStatusRef>(null)

   return (
      <>
         <Button
            variant='outline'
            size='sm'
            onClick={() => ref.current?.open(application, JobApplicationStatus.PENDING)}
         >
            <ClockIcon />
            En attente
         </Button>
         <AlertDialogUpdateApplicationStatus ref={ref} />
      </>
   )
}

export default PendingButton
