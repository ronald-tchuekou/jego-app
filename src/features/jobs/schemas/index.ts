import { JobStatus } from '@/services/job-service'
import { z } from 'zod'

export const jobStatusSchema = z.object({
   jobId: z.string().min(1, "L'ID du job est requis"),
   status: z.enum([JobStatus.OPEN, JobStatus.CLOSED], 'Le statut est requis'),
})

export const createJobSchema = z.object({
   title: z.string().min(1, 'Le titre est requis').max(255, 'Le titre ne doit pas dépasser 255 caractères'),
   description: z
      .string()
      .min(1, 'La description est requise')
      .max(5000, 'La description ne doit pas dépasser 5000 caractères'),
   companyName: z.string().optional(),
   companyLogo: z.string().optional(),
   companyWebsite: z.string().optional(),
   companyEmail: z.email('Email invalide').optional(),
   companyPhone: z.string().optional(),
   companyAddress: z.string().optional(),
   companyCity: z.string().optional(),
   companyState: z.string().optional(),
   companyZip: z.string().optional(),
   companyCountry: z.string().optional(),
   expiresAt: z.string().optional(),
})

export const updateJobSchema = z.object({
   jobId: z.string().min(1, "L'ID du job est requis"),
   title: z.string().min(1, 'Le titre est requis').max(255, 'Le titre ne doit pas dépasser 255 caractères').optional(),
   description: z
      .string()
      .min(1, 'La description est requise')
      .max(5000, 'La description ne doit pas dépasser 5000 caractères')
      .optional(),
   companyName: z.string().optional(),
   companyLogo: z.string().optional(),
   companyWebsite: z.string().optional(),
   companyEmail: z.email('Email invalide').optional(),
   companyPhone: z.string().optional(),
   companyAddress: z.string().optional(),
   companyCity: z.string().optional(),
   companyState: z.string().optional(),
   companyZip: z.string().optional(),
   companyCountry: z.string().optional(),
   expiresAt: z.string().optional(),
})

export const deleteJobSchema = z.object({
   jobId: z.string().min(1, "L'ID du job est requis"),
})

export type JobStatusInput = z.infer<typeof jobStatusSchema>
export type CreateJobInput = z.infer<typeof createJobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>
export type DeleteJobInput = z.infer<typeof deleteJobSchema>
