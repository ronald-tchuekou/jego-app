import { PostType } from '@/services/post-service'
import { UserRole } from '@/services/user-service'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { FileType } from './helper-types'

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 500MB in bytes

export const ACCEPTED_FILE_TYPES = {
   [FileType.IMAGE]: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
   [FileType.VIDEO]: ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'],
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

export function fmtMsgTime(d: string | Date) {
   const t = new Date(d).getTime()
   const n = Date.now()
   const s = Math.floor((n - t) / 1000)
   if (s < 60) return 'À l’instant'
   if (s < 3600) return `Y'a ${Math.floor(s / 60)} min`
   if (s < 86400) return `y'a ${Math.floor(s / 3600)} h`
   if (s < 172800) return 'Hier'
   if (s < 2592000) return `Y'a ${Math.floor(s / 86400)} js`
   const date = new Date(d)
   return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number; ratio: string }> {
   return new Promise((resolve, reject) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)

      img.onload = () => {
         const width = img.width
         const height = img.height

         // Simplification to format like "16:9"
         const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
         const divisor = gcd(width, height)
         const ratioLabel = `${width / divisor}:${height / divisor}`

         URL.revokeObjectURL(objectUrl) // cleanup
         resolve({ width, height, ratio: ratioLabel })
      }

      img.onerror = () => {
         URL.revokeObjectURL(objectUrl)
         reject(new Error('Invalid image file'))
      }

      img.src = objectUrl
   })
}

export function getVideoMetadata(
   file: File,
): Promise<{ width: number; height: number; duration: number; ratio: string } | null> {
   return new Promise((resolve, reject) => {
      // ✅ Vérifier si c’est une vidéo
      if (!file.type.startsWith('video/')) {
         return resolve(null)
      }

      const video = document.createElement('video')
      video.preload = 'metadata'

      const objectUrl = URL.createObjectURL(file)
      video.src = objectUrl

      video.onloadedmetadata = () => {
         const width = video.videoWidth
         const height = video.videoHeight
         const duration = video.duration

         // Format ratio style “16:9”
         const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
         const divisor = gcd(width, height)
         const ratioLabel = `${width / divisor}:${height / divisor}`

         URL.revokeObjectURL(objectUrl)

         resolve({ width, height, duration, ratio: ratioLabel })
      }

      video.onerror = () => {
         URL.revokeObjectURL(objectUrl)
         reject(new Error('Failed to load video'))
      }
   })
}

export const formatDuration = (seconds: number) => {
   const mins = Math.floor(seconds / 60)
   const secs = seconds % 60
   return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const getAspectRatioClass = (aspectRatio?: string) => {
   switch (aspectRatio) {
      case '16:9':
         return 'aspect-video'
      case '9:16':
         return 'aspect-[9/16]'
      case '1:1':
         return 'aspect-square'
      case '4:5':
         return 'aspect-[4/5]'
      default:
         return 'aspect-video'
   }
}
