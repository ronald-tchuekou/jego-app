import fetchHelper from '@/lib/helpers/fetch-helper'
import { objectToQueryString } from '@/lib/utils'
import { UserModel } from './user-service'

export enum JobStatus {
   OPEN = 'open',
   CLOSED = 'closed',
}

export type JobModel = {
   id: string
   userId: string
   title: string
   description: string
   companyName: string | null
   companyLogo: string | null
   companyWebsite: string | null
   companyEmail: string | null
   companyPhone: string | null
   companyAddress: string | null
   companyCity: string | null
   companyState: string | null
   companyZip: string | null
   companyCountry: string | null
   expiresAt: string | null
   status: JobStatus
   createdAt: string
   updatedAt: string
   user: UserModel
}

const JobService = {
   async count(search: string = '') {
      const { data, error } = await fetchHelper<{ count: number }>(`/jobs/count?search=${search}`, {
         headers: {
            'Content-Type': 'application/json',
         },
      })
      if (error) throw new Error(error)
      return data?.count
   },
   async getAll(filter: FilterQuery & { status?: string }) {
      const query = objectToQueryString(filter)

      const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(`/jobs?${query}`)
      if (error) throw new Error(error)
      return data
   },

   async getById(id: string) {
      const { data, error } = await fetchHelper<{ data: JobModel }>(`/jobs/${id}`)
      if (error) throw new Error(error)
      return data?.data || null
   },

   async create(body: Partial<JobModel>, token: string) {
      const { data, error } = await fetchHelper<{ data: JobModel }>('/jobs', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(body),
      })
      if (error) throw new Error(error)
      return data?.data
   },

   async update(id: string, body: Partial<JobModel>, token: string) {
      const { data, error } = await fetchHelper<{ data: JobModel }>(`/jobs/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(body),
      })
      if (error) throw new Error(error)
      return data?.data
   },

   async delete(id: string, token: string) {
      const { data, error } = await fetchHelper<{ message: string }>(`/jobs/${id}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
      })
      if (error) throw new Error(error)
      return data
   },

   async toggleStatus(id: string, token: string) {
      const { data, error } = await fetchHelper<{ data: JobModel }>(`/jobs/${id}/toggle-status`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
      })
      if (error) throw new Error(error)
      return data?.data
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
      }>(`/jobs/count-per-day?${query}`, {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
      })
      if (error) throw new Error(error)
      return data
   },
}

export default JobService
