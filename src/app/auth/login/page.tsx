import LoaderContent from '@/components/base/loader-content'
import dynamic from 'next/dynamic'

const DynamicLoginForm = dynamic(() => import('@/features/auth/login/login-form'), {
   loading: () => <LoaderContent />,
})

export default function LoginPage() {
   return <DynamicLoginForm />
}
