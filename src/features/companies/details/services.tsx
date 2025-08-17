
import EmptyContent from '@/components/base/empty-content'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatPrice } from '@/lib/utils'
import { CompanyServiceModel } from '@/services/company-service-service'

type Props = {
   services: CompanyServiceModel[]
}

const CompanyServices = ({ services }: Props) => {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Services proposés par l&apos;entreprise</CardTitle>
            <CardDescription>Liste des différents services que l&apos;entreprise offre.</CardDescription>
         </CardHeader>

         <CardContent className='space-y-4'>
            <div className='border rounded-lg overflow-hidden'>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Nom du service</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Prix</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {services.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={3} className='text-center'>
                              <EmptyContent text="Cette entreprise n'a pas encore de service." />
                           </TableCell>
                        </TableRow>
                     ) : (
                        services.map((service) => (
                           <TableRow key={service.id}>
                              <TableCell>{service.label}</TableCell>
                              <TableCell>
                                 <p className='whitespace-normal line-clamp-2'>{service.description}</p>
                              </TableCell>
                              <TableCell>{service.price ? formatPrice(Number(service.price)) : '- - -'}</TableCell>
                           </TableRow>
                        ))
                     )}
                  </TableBody>
               </Table>
            </div>
         </CardContent>
      </Card>
   )
}

export default CompanyServices
