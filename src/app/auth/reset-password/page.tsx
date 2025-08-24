import dynamic from 'next/dynamic'

const DynamicResetPasswordForm = dynamic(() => import('@/features/auth/reset-password/reset-password-form'))

export default function ResetPasswordPage() {
   return <DynamicResetPasswordForm />
}
