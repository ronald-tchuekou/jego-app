import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import { DeleteAccountForm, UpdateEmailForm, UpdateImageProfileForm, UpdatePasswordForm } from '@/features/profile'
import { UpdateUserInfoForm } from '@/features/profile/update-user-info'

export default function Page() {
   return (
      <>
         <DashboardTitle title='Mon profil' />
         <div className='flex flex-col gap-6 max-w-5xl'>
            <UpdateImageProfileForm />
            <UpdateUserInfoForm />
            <UpdateEmailForm />
            <UpdatePasswordForm />
            <DeleteAccountForm />
            <div className='h-10' />
         </div>
      </>
   )
}
