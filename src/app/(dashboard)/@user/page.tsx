import { ChartAreaInteractive } from '@/components/dashboard/chart-area-interactive'
import { DataTable } from '@/components/dashboard/data-table'
import { SectionCards } from '@/components/dashboard/section-cards'
import data from '@/lib/data.json'

export default function UserPage() {
	return (
		<>
			<SectionCards />
			<div className='px-4 lg:px-6'>
				<ChartAreaInteractive />
			</div>
			<DataTable data={data} />
		</>
	)
}
