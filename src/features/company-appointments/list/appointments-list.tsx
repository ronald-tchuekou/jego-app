'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import CustomPagination from '@/components/dashboard/custom-pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useGetAppointments from '../hooks/use-get-appointments'
import AppointmentItem from './appointment-item'

const COLUMNS = [
   { name: 'Demandeur' },
   { name: 'Entreprise' },
   { name: 'Date & Heure' },
   { name: 'Sujet' },
   { name: 'Statut' },
   { name: 'Créé le' },
   { name: '', width: 50 },
]

type Props = {
   justRecent?: boolean
}

export default function AppointmentsList({ justRecent }: Props) {
   const { data, isLoading } = useGetAppointments({ justRecent })

   const appointments = data?.data || []
   const totalCount = data?.meta.total || 0
   const totalPages = data?.meta.lastPage || 1

   return (
      <>
         <div className='bg-card border rounded-lg shadow-lg'>
            <Table>
               <TableHeader>
                  <TableRow>
                     {COLUMNS.map((column) => (
                        <TableHead key={column.name} style={{ width: column.width }}>
                           {column.name}
                        </TableHead>
                     ))}
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {isLoading ? (
                     <TableRow>
                        <TableCell colSpan={COLUMNS.length}>
                           <LoaderContent />
                        </TableCell>
                     </TableRow>
                  ) : appointments.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={COLUMNS.length}>
                           <EmptyContent text='Aucun rendez-vous disponible dans votre base de données.' />
                        </TableCell>
                     </TableRow>
                  ) : (
                     appointments.map((appointment) => (
                        <AppointmentItem key={appointment.id} appointment={appointment} />
                     ))
                  )}
               </TableBody>
            </Table>
         </div>

         {!justRecent && <CustomPagination totalCount={totalCount} totalPages={totalPages} label='rendez-vous' />}
      </>
   )
}
