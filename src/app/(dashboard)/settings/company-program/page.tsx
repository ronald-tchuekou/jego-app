import dynamic from 'next/dynamic'

const DynamicEditCompanyProgramForm = dynamic(() => import('@/features/edit-company-program/form'))

export default function ProgramPage() {
   return <DynamicEditCompanyProgramForm />
}
