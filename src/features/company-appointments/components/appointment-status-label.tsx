import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AppointmentStatus } from '@/services/company-appointment-request-service'
import { Calendar, CalendarCheck, CalendarX, Clock } from 'lucide-react'

const statusConfig = {
   [AppointmentStatus.PENDING]: {
      label: 'En attente',
      variant: 'secondary' as const,
      icon: Clock,
      className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
   },
   [AppointmentStatus.CONFIRMED]: {
      label: 'Confirmé',
      variant: 'secondary' as const,
      icon: CalendarCheck,
      className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
   },
   [AppointmentStatus.CANCELLED]: {
      label: 'Annulé',
      variant: 'secondary' as const,
      icon: CalendarX,
      className: 'bg-red-100 text-red-700 hover:bg-red-100',
   },
   [AppointmentStatus.COMPLETED]: {
      label: 'Terminé',
      variant: 'secondary' as const,
      icon: Calendar,
      className: 'bg-green-100 text-green-700 hover:bg-green-100',
   },
}

type Props = {
   status: AppointmentStatus
   showIcon?: boolean
}

export default function AppointmentStatusLabel({ status, showIcon = true }: Props) {
   const config = statusConfig[status]
   const Icon = config.icon

   return (
      <Badge variant={config.variant} className={cn('gap-1', config.className)}>
         {showIcon && <Icon className='size-3' />}
         {config.label}
      </Badge>
   )
}
