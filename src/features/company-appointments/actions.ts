'use server'

import { authenticatedActionClient } from '@/lib/safe-action'
import CompanyAppointmentRequestService, { AppointmentStatus } from '@/services/company-appointment-request-service'
import { UserRole } from '@/services/user-service'
import { z } from 'zod'

// Action to get appointments with pagination and filters
export const getAppointmentsAction = authenticatedActionClient
   .metadata({ actionName: 'getAppointmentsAction' })
   .inputSchema(
      z.object({
         page: z.number().min(1).default(1),
         limit: z.number().min(1).max(100).default(10),
         search: z.string().optional(),
         status: z.string().optional(),
         dateFrom: z.string().optional(),
         dateTo: z.string().optional(),
      })
   )
   .action(async ({ parsedInput: { page, limit, search, status, dateFrom, dateTo }, ctx }) => {
      const filters: FilterQuery & { 
         status?: AppointmentStatus
         userId?: string
         companyId?: string
         dateFrom?: string
         dateTo?: string
      } = { page, limit }

      if (search) filters.search = search

      if (status && status !== 'all') {
         filters.status = status as AppointmentStatus
      }

      if (dateFrom) filters.dateFrom = dateFrom
      if (dateTo) filters.dateTo = dateTo

      // If user is from a company, filter by company
      if (ctx.user.companyId) {
         filters.companyId = ctx.user.companyId
      }

      // If regular user, filter by user
      if (ctx.user.role === UserRole.USER) {
         filters.userId = ctx.user.id
      }

      return CompanyAppointmentRequestService.getAll(filters, ctx.token)
   })

// Action to get appointment by id
export const getAppointmentByIdAction = authenticatedActionClient
   .metadata({ actionName: 'getAppointmentByIdAction' })
   .inputSchema(z.object({ appointmentId: z.string().min(1, "L'ID du rendez-vous est requis") }))
   .action(async ({ parsedInput: { appointmentId }, ctx }) => {
      return CompanyAppointmentRequestService.getById(appointmentId, ctx.token)
   })

// Action to update appointment status
export const updateAppointmentStatusAction = authenticatedActionClient
   .metadata({ actionName: 'updateAppointmentStatusAction' })
   .inputSchema(
      z.object({
         appointmentId: z.string().min(1, "L'ID du rendez-vous est requis"),
         status: z.enum(['pending', 'confirmed', 'cancelled', 'completed'] as const),
      })
   )
   .action(async ({ parsedInput: { appointmentId, status }, ctx }) => {
      try {
         // Check if user has permission to update appointment status
         if (ctx.user.role !== UserRole.ADMIN && ctx.user.role !== UserRole.COMPANY_ADMIN && ctx.user.role !== UserRole.COMPANY_AGENT) {
            throw new Error("Vous n'avez pas la permission de modifier le statut des rendez-vous")
         }

         const appointment = await CompanyAppointmentRequestService.updateStatus(
            appointmentId, 
            status as AppointmentStatus,
            ctx.token
         )

         return {
            success: true,
            message: 'Statut du rendez-vous modifié avec succès',
            appointment,
         }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors de la modification du statut du rendez-vous')
      }
   })

// Action to delete an appointment
export const deleteAppointmentAction = authenticatedActionClient
   .metadata({ actionName: 'deleteAppointmentAction' })
   .inputSchema(
      z.object({
         appointmentId: z.string().min(1, "L'ID du rendez-vous est requis"),
      })
   )
   .action(async ({ parsedInput: { appointmentId }, ctx }) => {
      try {
         await CompanyAppointmentRequestService.delete(appointmentId, ctx.token)
         return { success: true, message: 'Rendez-vous supprimé avec succès' }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors de la suppression du rendez-vous')
      }
   })

// Action to get appointment statistics
export const getAppointmentStatisticsAction = authenticatedActionClient
   .metadata({ actionName: 'getAppointmentStatisticsAction' })
   .action(async ({ ctx }) => {
      try {
         return CompanyAppointmentRequestService.getStatistics(ctx.token)
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors du chargement des statistiques')
      }
   })

// Action to get upcoming appointments
export const getUpcomingAppointmentsAction = authenticatedActionClient
   .metadata({ actionName: 'getUpcomingAppointmentsAction' })
   .inputSchema(
      z.object({
         days: z.number().min(1).default(7),
      })
   )
   .action(async ({ parsedInput: { days }, ctx }) => {
      try {
         return CompanyAppointmentRequestService.getUpcoming(days, ctx.token)
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors du chargement des rendez-vous à venir')
      }
   })

// Action to mark appointment as read
export const markAppointmentAsReadAction = authenticatedActionClient
   .metadata({ actionName: 'markAppointmentAsReadAction' })
   .inputSchema(
      z.object({
         appointmentId: z.string().min(1, "L'ID du rendez-vous est requis"),
      })
   )
   .action(async ({ parsedInput: { appointmentId }, ctx }) => {
      try {
         const appointment = await CompanyAppointmentRequestService.markAsRead(appointmentId, ctx.token)
         return {
            success: true,
            message: 'Rendez-vous marqué comme lu',
            appointment,
         }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors du marquage du rendez-vous comme lu')
      }
   })

// Action to update appointment
export const updateAppointmentAction = authenticatedActionClient
   .metadata({ actionName: 'updateAppointmentAction' })
   .inputSchema(
      z.object({
         appointmentId: z.string().min(1, "L'ID du rendez-vous est requis"),
         date: z.string().optional(),
         time: z.string().optional(),
         subject: z.string().optional(),
         content: z.string().optional(),
      })
   )
   .action(async ({ parsedInput: { appointmentId, ...data }, ctx }) => {
      try {
         const appointment = await CompanyAppointmentRequestService.update(appointmentId, data, ctx.token)
         return {
            success: true,
            message: 'Rendez-vous mis à jour avec succès',
            appointment,
         }
      } catch (error) {
         console.error(error)
         throw new Error('Erreur lors de la mise à jour du rendez-vous')
      }
   })
