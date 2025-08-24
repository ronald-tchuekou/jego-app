import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import dynamic from 'next/dynamic'

const DynamicUpdateImageProfileForm = dynamic(
   () => import('@/features/profile/update-image-profile/update-image-profile-form')
)
const DynamicUpdateUserInfoForm = dynamic(() => import('@/features/profile/update-user-info/update-user-info-form'))
const DynamicUpdateEmailForm = dynamic(() => import('@/features/profile/update-email/update-email-form'))
const DynamicUpdatePasswordForm = dynamic(() => import('@/features/profile/update-password/update-password-form'))
const DynamicDeleteAccountForm = dynamic(() => import('@/features/profile/delete-account/delete-account-form'))

export default function Page() {
   return (
      <>
         <DashboardTitle title='Mon profil' />
         <div className='flex flex-col gap-6 max-w-5xl'>
            <DynamicUpdateImageProfileForm />
            <DynamicUpdateUserInfoForm />
            <DynamicUpdateEmailForm />
            <DynamicUpdatePasswordForm />
            <DynamicDeleteAccountForm />
            <div className='h-10' />
         </div>
      </>
   )
}
