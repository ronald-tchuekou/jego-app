import dynamic from 'next/dynamic'

const DynamicLoginForm = dynamic(() => import('@/features/auth/login/login-form'))

export default function LoginPage() {
   return <DynamicLoginForm />
}
