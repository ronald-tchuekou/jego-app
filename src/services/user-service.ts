import { DateTime } from "luxon"
import { CompanyModel } from "./company-service"
import { PostModel } from "./post-service"

export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
	COMPANY_ADMIN = 'company:admin',
	COMPANY_AGENT = 'company:agent',
}

export type UserModel = {
  id: string
  firstName: string
  lastName: string
  displayName: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
   zipCode: string | null
  country: string | null
  email: string
  password: string
  role: UserRole
  companyId: string | null
  profileImage: string | null
  verifiedAt: DateTime | null
  lastLoginAt: DateTime | null
  blockedAt: DateTime | null
  createdAt: DateTime
  updatedAt: DateTime
  company?: CompanyModel
  posts?: PostModel[]
}

const UserService = {

}

export default UserService;
