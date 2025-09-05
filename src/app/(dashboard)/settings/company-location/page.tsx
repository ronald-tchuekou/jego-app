import dynamic from 'next/dynamic'

const DynamicEditCompanyLocationForm = dynamic(() => import('@/features/edit-company-location/form'))

export default function CompanyLocationPage() {
   return <DynamicEditCompanyLocationForm />
}
