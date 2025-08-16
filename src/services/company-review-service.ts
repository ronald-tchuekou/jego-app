import { CompanyModel } from './company-service'
import { UserModel } from './user-service'

export type CompanyReviewModel = {
   id: string
   companyId: string
   userId: string
   comment: string
   rating: number
   isApproved: boolean
   createdAt: string
   updatedAt: string
   company: CompanyModel
   user: UserModel
}

const CompanyReviewService = {}

export default CompanyReviewService
