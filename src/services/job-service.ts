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
   async count(companyId?: string) {
      const { data, error } = await fetchHelper<{ count: number }>(`/jobs/count?companyId=${companyId || ''}`, {
         headers: {
            'Content-Type': 'application/json',
         },
      })
      if (error) throw new Error(error)
      return data?.count
   },

   async getAll(filter: FilterQuery & { status?: JobStatus; companyName?: string }) {
      const query = objectToQueryString(filter)
      const companyId = filter.companyId
      const withoutCompanyId = companyId ? `/company/${companyId}` : ''

      const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(`/jobs${withoutCompanyId}?${query}`)
      if (error) throw new Error(error)
      return data
   },

   async getById(id: string) {
      const { data, error } = await fetchHelper<{ data: JobModel }>(`/jobs/${id}`)
      if (error) throw new Error(error)
      return data?.data || null
   },

   async getByUserId(userId: string) {
      const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(`/jobs/user/${userId}`)
      if (error) throw new Error(error)
      return data
   },

   async getExpired() {
      const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(`/jobs/expired`)
      if (error) throw new Error(error)
      return data
   },

   async getActive() {
      const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(`/jobs/active`)
      if (error) throw new Error(error)
      return data
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

   async closeOne(id: string, token: string) {
      const { data, error } = await fetchHelper<{ data: JobModel }>(`/jobs/${id}/close`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
      })
      if (error) throw new Error(error)
      return data?.data
   },

   async reopenOne(id: string, token: string) {
      const { data, error } = await fetchHelper<{ data: JobModel }>(`/jobs/${id}/reopen`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
      })
      if (error) throw new Error(error)
      return data?.data
   },

   async setExpireDate(id: string, expireDate: Date, token: string) {
      const { data, error } = await fetchHelper<{ data: JobModel }>(`/jobs/${id}/set-expiration`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({ expiresAt: expireDate }),
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

   async getStats() {
      const { data, error } = await fetchHelper<{
         data: {
            total: number
            open: number
            closed: number
            expired: number
            active: number
            withCompany: number
            withoutCompany: number
         }
      }>(`/jobs/stats`)
      if (error) throw new Error(error)
      return data?.data
   },
}

export default JobService
