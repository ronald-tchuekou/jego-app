import ViewAsMarkdown from '@/components/base/view-as-markdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { JobApplicationModel } from '@/services/job-application-service'
import { BriefcaseIcon, BuildingIcon, MapPinIcon } from 'lucide-react'

type Props = {
   application: JobApplicationModel
}

const PostInfo = ({ application }: Props) => {
   return (
      <Card>
         <CardHeader>
            <CardTitle className='flex items-center gap-2'>
               <BriefcaseIcon className='size-8' />
               Poste concerné
            </CardTitle>
         </CardHeader>
         <CardContent className='space-y-4'>
            <p className='font-medium text-lg'>{application.job.title}</p>
            <ViewAsMarkdown markdown={application.job.description} />
            <Separator />
            <div className='space-y-3'>
               <div className='flex items-center gap-2'>
                  <BuildingIcon className='size-4 text-muted-foreground' />
                  <span className='text-sm'>{application.job.companyName}</span>
               </div>
               <div className='flex items-center gap-2'>
                  <MapPinIcon className='size-4 text-muted-foreground' />
                  <span className='text-sm'>{application.job.companyAddress}</span>
               </div>
            </div>
         </CardContent>
      </Card>
   )
}

export default PostInfo
