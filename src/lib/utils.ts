import { PostType } from '@/services/post-service'
import { UserRole } from '@/services/user-service'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

// Function to convert and object to a request query params
export function objectToQueryString(obj: Record<string, any>) {
   return Object.keys(obj)
      .map((key) => `${key}=${obj[key] || ''}`)
      .join('&')
}

export function compactNumber(num: number) {
   return new Intl.NumberFormat('fr-FR', {
      notation: 'compact',
   }).format(num)
}

// Helper function to get role badge variant
export function getRoleBadgeVariant(role: UserRole) {
   switch (role) {
      case UserRole.ADMIN:
         return 'destructive'
      case UserRole.COMPANY_ADMIN:
         return 'default'
      case UserRole.COMPANY_AGENT:
         return 'secondary'
      default:
         return 'outline'
   }
}

// Helper function to get role label in French
export function getRoleLabel(role: UserRole) {
   switch (role) {
      case UserRole.ADMIN:
         return 'Administrateur'
      case UserRole.COMPANY_ADMIN:
         return 'Gérant Entreprise'
      case UserRole.COMPANY_AGENT:
         return 'Agent Entreprise'
      case UserRole.USER:
         return 'Utilisateur'
      default:
         return role
   }
}

// Helper function to format date
export function formatDate(date: string | null) {
   if (!date) return 'Jamais'
   return Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
   }).format(new Date(date))
}

export function formatPrice(price: number) {
   return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
   }).format(price)
}

export function getSlug(name: string) {
   return name.toLowerCase().replace(/ /g, '-')
}

export function getPostTypeLabel(type: PostType) {
   switch (type) {
      case PostType.EVENT:
         return 'Événement'
      case PostType.NEWS:
         return 'News'
      default:
         return '- - -'
   }
}

export function getUserRoleLabel(role?: UserRole | null) {
   if (role === UserRole.ADMIN) return 'Administrateur'
   if (role === UserRole.COMPANY_ADMIN) return 'Administrateur Entreprise'
   if (role === UserRole.COMPANY_AGENT) return 'Agent Entreprise'
   return 'Utilisateur'
}
