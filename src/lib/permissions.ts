import { JobModel } from '@/services/job-service'
import { UserModel, UserRole } from '@/services/user-service'

export function getEditJobPermissions(user: UserModel | undefined, job: JobModel) {
   const isAdmin = user?.role === UserRole.ADMIN
   const isAuthor = user?.companyId && user?.companyId === job.user?.companyId
   const canEdit = isAdmin || isAuthor
   const canDelete = isAdmin || isAuthor
   const canChangeStatus = isAdmin || isAuthor

   return { canEdit, canDelete, canChangeStatus }
}
