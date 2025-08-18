import { NavMainItem } from '@/components/dashboard/nav-main'
import { PostType } from '@/services/post-service'
import { UserRole } from '@/services/user-service'
import {
   IconBriefcase,
   IconChartBar,
   IconDashboard,
   IconListDetails,
   IconSettings,
   IconUsers,
} from '@tabler/icons-react'
import { CircleUserIcon } from 'lucide-react'

export const AUTH_COOKIE_NAME = '__jego_auth_key__'
export const DEFAULT_AVATAR = '/user-avatar.webp'
export const DEFAULT_COMPANY_IMAGE = '/company-image.webp'
export const AUTH_COOKIE_EXPIRES_AT = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
export const ROUTES: NavMainItem[] = [
   {
      title: 'Dashboard',
      url: '/',
      icon: IconDashboard,
   },
   {
      title: 'Annonces',
      url: '/posts',
      icon: IconListDetails,
      allowedRoles: [UserRole.ADMIN, UserRole.COMPANY_ADMIN, UserRole.COMPANY_AGENT],
   },
   {
      title: 'Entreprises',
      url: '/companies',
      icon: IconChartBar,
      allowedRoles: [UserRole.ADMIN],
   },
   {
      title: 'Utilisateurs',
      url: '/users',
      icon: IconUsers,
      allowedRoles: [UserRole.ADMIN],
   },
   {
      title: "Offres d'emploi",
      url: '/jobs',
      icon: IconBriefcase,
      allowedRoles: [UserRole.USER, UserRole.COMPANY_ADMIN, UserRole.COMPANY_AGENT],
   },
   {
      title: 'Paramètres',
      url: '/settings',
      icon: IconSettings,
   },
   {
      title: 'Profil',
      url: '/profile',
      icon: CircleUserIcon,
   },
]
export const POST_TYPES = [
   {
      value: PostType.EVENT,
      label: 'Événement',
   },
   {
      value: PostType.NEWS,
      label: 'News',
   },
]