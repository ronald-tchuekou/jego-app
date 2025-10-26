'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import CustomPagination from '@/components/dashboard/custom-pagination'
import { useAuth } from '@/components/providers/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UserRole } from '@/services/user-service'
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
   const { auth } = useAuth()
   const isAdmin = auth?.user?.role === UserRole.ADMIN
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
                     {COLUMNS.map((column) =>
                        column.name !== 'Entreprise' ? (
                           <TableHead key={column.name} style={{ width: column.width }}>
                              {column.name}
                           </TableHead>
                        ) : isAdmin ? (
                           <TableHead key={column.name} style={{ width: column.width }}>
                              {column.name}
                           </TableHead>
                        ) : null,
                     )}
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {isLoading ? (
                     <TableRow>
                        <TableCell colSpan={isAdmin ? COLUMNS.length : COLUMNS.length - 1}>
                           <LoaderContent />
                        </TableCell>
                     </TableRow>
                  ) : appointments.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={isAdmin ? COLUMNS.length : COLUMNS.length - 1}>
                           <EmptyContent text='Aucun rendez-vous disponible dans votre base de données.' />
                        </TableCell>
                     </TableRow>
                  ) : (
                     appointments.map((appointment) => (
                        <AppointmentItem key={appointment.id} appointment={appointment} isAdmin={isAdmin} />
                     ))
                  )}
               </TableBody>
            </Table>
         </div>

         {!justRecent && <CustomPagination totalCount={totalCount} totalPages={totalPages} label='rendez-vous' />}
      </>
   )
}
