import LoaderContent from '@/components/base/loader-content'
import dynamic from 'next/dynamic'

const DynamicRegisterForm = dynamic(() => import('@/features/auth/register/register-form'), {
   loading: () => <LoaderContent />,
})

export default function RegisterPage() {
   return <DynamicRegisterForm />
}
