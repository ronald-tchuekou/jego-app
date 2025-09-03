import { CompanyModel } from './company-service'
import { UserModel } from './user-service'

export enum AppointmentStatus {
   PENDING = 'pending',
   CONFIRMED = 'confirmed',
   CANCELLED = 'cancelled',
   COMPLETED = 'completed',
}

export type CompanyAppointmentRequestModel = {
   id: string
   companyId: string
   userId: string
   date: string
   time: string
   status: AppointmentStatus
   subject: string
   content: string
   isRead: boolean
   createdAt: string
   updatedAt: string
   company: CompanyModel
   user: UserModel
}

const CompanyAppointmentRequestService = {}

export default CompanyAppointmentRequestService
