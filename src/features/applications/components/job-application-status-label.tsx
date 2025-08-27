import { Badge } from "@/components/ui/badge"
import { JobApplicationStatus } from "@/services/job-application-service"

type Props = {
   status: JobApplicationStatus
}

const JobApplicationStatusLabel = ({status}: Props) => {
   switch (status) {
      case JobApplicationStatus.PENDING:
         return (
            <Badge variant='outline' className='bg-yellow-50 text-yellow-700 border-yellow-300'>
               En attente
            </Badge>
         )
      case JobApplicationStatus.ACCEPTED:
         return (
            <Badge variant='outline' className='bg-green-50 text-green-700 border-green-300'>
               Acceptée
            </Badge>
         )
      case JobApplicationStatus.REJECTED:
         return (
            <Badge variant='outline' className='bg-red-50 text-red-700 border-red-300'>
               Rejetée
            </Badge>
         )
      default:
         return <Badge variant='outline'>Inconnu</Badge>
   }
}


export default JobApplicationStatusLabel