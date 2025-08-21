import LoaderContent from '@/components/base/loader-content'
import dynamic from 'next/dynamic'

const DynamicForgotPassForm = dynamic(() => import('@/features/auth/forgot-pass/forgot-pass-form'), {
   loading: () => <LoaderContent />,
})

export default function ForgotPasswordPage() {
   return <DynamicForgotPassForm />
}
