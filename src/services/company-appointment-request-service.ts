import { CompanyModel } from './company-service'
import { UserModel } from './user-service'

export type CompanyAppointmentRequestModel = {
   id: string
   companyId: string
   userId: string
   object: string
   content: string
   isRead: boolean
   date: string
   createdAt: string
   updatedAt: string
   company: CompanyModel
   user: UserModel
}

const CompanyAppointmentRequestService = {}

export default CompanyAppointmentRequestService
