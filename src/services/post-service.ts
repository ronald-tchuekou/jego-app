import { DateTime } from 'luxon'
import { UserModel } from './user-service'

export type PostModel = {
   id: string
   userId: string
   title: string
   description: string
   status: string
   type: string
   category: string
   createdAt: DateTime
   updatedAt: DateTime
   user: UserModel
}

const PostService = {}

export default PostService
