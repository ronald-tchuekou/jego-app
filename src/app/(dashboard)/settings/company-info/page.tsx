import dynamic from 'next/dynamic'

const DynamicEditCompanyInfoForm = dynamic(() => import('@/features/edit-company-info/form'))

export default function CompanyInfoPage() {
   return <DynamicEditCompanyInfoForm />
}
