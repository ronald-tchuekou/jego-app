import dynamic from 'next/dynamic'

const DynamicRegisterForm = dynamic(() => import('@/features/auth/register/register-form'))

export default function RegisterPage() {
   return <DynamicRegisterForm />
}
