import LoaderContent from '@/components/base/loader-content'
import dynamic from 'next/dynamic'

const DynamicResetPasswordForm = dynamic(() => import('@/features/auth/reset-password/reset-password-form'), {
   loading: () => <LoaderContent />,
})

export default function ResetPasswordPage() {
   return <DynamicResetPasswordForm />
}
