import fetchHelper from '@/lib/helpers/fetch-helper'
import { objectToQueryString } from '@/lib/utils'
import { MediaModel } from './media_service'
import { UserModel } from './user-service'

export enum PostType {
   EVENT = 'event',
   NEWS = 'news',
}

export type PostModel = {
   id: string
   userId: string
   title: string
   description: string
   status: string
   type: PostType
   category: string
   mediaType: 'image' | 'video' | null
   medias: MediaModel[]
   createdAt: string
   updatedAt: string
   user: UserModel
}

type CreatePostDto = {
   title?: string
   description: string
   status: string
   type: string
   category: string
   mediaType?: 'image' | 'video'
   medias?: {
      name: string
      type: string
      url: string
      size: number
      thumbnailUrl?: string
      alt?: string
      metadata?: Record<string, any>
   }[]
}

const PostService = {
   async count(token: string, companyId?: string) {
      const { data, error } = await fetchHelper<{ count: number }>(`/posts/count?companyId=${companyId || ''}`, {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
      })
      if (error) throw new Error(error)
      return data?.count
   },
   async getAll(filter: FilterQuery & { status?: string; category?: string; type?: string }) {
      const query = objectToQueryString(filter)
      const companyId = filter.companyId
      const withoutCompanyId = companyId ? `/company/${companyId}` : ''

      const { data, error } = await fetchHelper<PaginateResponse<PostModel>>(`/posts${withoutCompanyId}?${query}`)
      if (error) throw new Error(error)
      return data
   },

   async getById(id: string) {
      const { data, error } = await fetchHelper<{ data: PostModel }>(`/posts/${id}`)
      if (error) throw new Error(error)
      return data?.data || null
   },

   async create(body: CreatePostDto, token: string) {
      const { data, error } = await fetchHelper<{ post: PostModel }>('/posts', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(body),
      })
      if (error) throw new Error(error)
      return data?.post
   },

   async update(id: string, body: Partial<CreatePostDto>, token: string) {
      const { data, error } = await fetchHelper<{ post: PostModel }>(`/posts/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(body),
      })
      if (error) throw new Error(error)
      return data?.post
   },

   async delete(id: string, token: string) {
      const { data, error } = await fetchHelper<{ message: string }>(`/posts/${id}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
      })
      if (error) throw new Error(error)
      return data
   },

   async updateStatus(id: string, status: string, token: string) {
      const { data, error } = await fetchHelper<{ post: PostModel }>(`/posts/${id}/status`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({ status }),
      })
      if (error) throw new Error(error)
      return data?.post
   },

   async chartData(token: string, range?: { startDate: string; endDate: string }) {
      let query = ''
      if (range) {
         query = objectToQueryString(range)
      }
      const { data, error } = await fetchHelper<{
         data: { date: string; count: number }[]
         startDate: string
         endDate: string
      }>(`/posts/count-per-day?${query}`, {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
      })
      if (error) throw new Error(error)
      return data
   },
}

export default PostService
