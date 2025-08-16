import { UserModel } from './user-service'

export type PostModel = {
   id: string
   userId: string
   title: string
   description: string
   status: string
   type: string
   category: string
   createdAt: string
   updatedAt: string
   user: UserModel
}

const PostService = {}

export default PostService
