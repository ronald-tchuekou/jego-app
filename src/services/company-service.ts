import { DateTime } from 'luxon'
import { PostModel } from './post-service'
import { UserModel } from './user-service'

export type CompanyModel = {
   id: string
   name: string
   email: string
   phone: string
   address: string
   city: string | null
   state: string | null
   zip_code: string | null
   country: string | null
   website: string | null
   logo: string | null
   description: string | null
   verified_at: DateTime | null
   blocked_at: DateTime | null
   createdAt: DateTime
   updatedAt: DateTime
   posts: PostModel[]
   users: UserModel[]
}

const CompanyService = {}

export default CompanyService
