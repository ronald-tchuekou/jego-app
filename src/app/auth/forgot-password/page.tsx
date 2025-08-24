import dynamic from 'next/dynamic'

const DynamicForgotPassForm = dynamic(() => import('@/features/auth/forgot-pass/forgot-pass-form'))

export default function ForgotPasswordPage() {
   return <DynamicForgotPassForm />
}
