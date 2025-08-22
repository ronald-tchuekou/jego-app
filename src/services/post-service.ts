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
   image: string | null
   createdAt: string
   updatedAt: string
   user: UserModel
}

import fetchHelper from '@/lib/helpers/fetch-helper'
import { objectToQueryString } from '@/lib/utils'

const PostService = {
   async count(token: string, search: string = '') {
      const { data, error } = await fetchHelper<{ count: number }>(`/posts/count?search=${search}`, {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
      })
      console.log(data, error)
      if (error) throw new Error(error)
      return data?.count
   },
   async getAll(filter: FilterQuery & { status?: string; category?: string; type?: string }) {
      const query = objectToQueryString(filter)

      const { data, error } = await fetchHelper<PaginateResponse<PostModel>>(`/posts?${query}`)
      if (error) throw new Error(error)
      return data
   },

   async getById(id: string) {
      const { data, error } = await fetchHelper<{ data: PostModel }>(`/posts/${id}`)
      if (error) throw new Error(error)
      return data?.data || null
   },

   async create(body: Partial<PostModel>, token: string) {
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

   async update(id: string, body: Partial<PostModel>, token: string) {
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
