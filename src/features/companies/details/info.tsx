import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { DEFAULT_COMPANY_IMAGE } from '@/lib/constants'
import env from '@/lib/env/client'
import { cn, formatDate } from '@/lib/utils'
import { CompanyModel } from '@/services/company-service'
import { BanIcon, CheckCircleIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { BlockCompanyDialog, DeleteCompanyDialog } from '../list/company-item-actions'
import CompanyVerificationStatus from '../list/company-verification-status'
import RatingAverage from './rating-av'
import SocialLinks from './social-links'

type Props = {
   company: CompanyModel
}

const CompanyInfo = ({ company }: Props) => {
   const deleteDialogRef = useRef<{ open: VoidFunction }>(null)
   const blockDialogRef = useRef<{ open: VoidFunction }>(null)

   const router = useRouter()

   const initials = company.name.charAt(0).toUpperCase()
   const companyLogo = company?.logo ? `${env.NEXT_PUBLIC_API_URL}/v1/${company?.logo}` : DEFAULT_COMPANY_IMAGE

   return (
      <>
         <Card>
            <CardHeader>
               <CardTitle>Information de l&apos;entreprise</CardTitle>
               <CardDescription>{null}</CardDescription>
            </CardHeader>

            <CardContent className='space-y-4'>
               <Avatar className='size-32 border-2 border-primary'>
                  <AvatarImage src={companyLogo} alt={company.name} />
                  <AvatarFallback className='text-2xl'>{initials}</AvatarFallback>
               </Avatar>
               <RatingAverage companyId={company.id} />
               <SocialLinks company={company} />

               <div className='border rounded-lg overflow-hidden'>
                  <Table>
                     <TableBody>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Nom de l&apos;entreprise :</TableCell>
                           <TableCell className='font-bold'>{company.name}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Email :</TableCell>
                           <TableCell className='font-bold'>{company.email || '- - -'}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Téléphone :</TableCell>
                           <TableCell className='font-bold'>{company.phone || '- - -'}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Adresse :</TableCell>
                           <TableCell className='font-bold'>{company.address || '- - -'}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Ville :</TableCell>
                           <TableCell className='font-bold'>{company.city || '- - -'}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>État/Province :</TableCell>
                           <TableCell className='font-bold'>{company.state || '- - -'}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Code postal :</TableCell>
                           <TableCell className='font-bold'>{company.zipCode || '- - -'}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Pays :</TableCell>
                           <TableCell className='font-bold'>{company.country || '- - -'}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Site web :</TableCell>
                           <TableCell className='font-bold'>
                              {company.website ? (
                                 <a
                                    href={company.website}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary hover:underline'
                                 >
                                    {company.website}
                                 </a>
                              ) : (
                                 '- - -'
                              )}
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Description :</TableCell>
                           <TableCell className='font-bold whitespace-normal'>
                              {company.description || '- - -'}
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Catégorie :</TableCell>
                           <TableCell className='font-bold'>{company.category?.name || '- - -'}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Statut de vérification :</TableCell>
                           <TableCell>
                              <CompanyVerificationStatus company={company} />
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Statut :</TableCell>
                           <TableCell
                              className={cn('font-bold', {
                                 'text-red-500': company.blockedAt,
                                 'text-green-500': !company.blockedAt,
                              })}
                           >
                              {company.blockedAt ? 'Bloquée' : 'Active'}
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Nombre d&apos;utilisateurs :</TableCell>
                           <TableCell className='font-bold'>{company.users?.length || 0}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Nombre de posts :</TableCell>
                           <TableCell className='font-bold'>{company.posts?.length || 0}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Nombre de services :</TableCell>
                           <TableCell className='font-bold'>{company.services?.length || 0}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Date de création :</TableCell>
                           <TableCell className='font-bold'>{formatDate(company.createdAt)}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className='text-muted-foreground'>Dernière mise à jour :</TableCell>
                           <TableCell className='font-bold'>{formatDate(company.updatedAt)}</TableCell>
                        </TableRow>
                     </TableBody>
                  </Table>
               </div>

               <div className='flex gap-3'>
                  <Button
                     size={'sm'}
                     variant={'outline'}
                     className={cn({
                        'text-green-500': company.blockedAt,
                        'text-red-500': !company.blockedAt,
                     })}
                     onClick={() => blockDialogRef.current?.open()}
                  >
                     {company.blockedAt ? <CheckCircleIcon className='size-4' /> : <BanIcon className='size-4' />}
                     <span className='hidden md:block'>
                        {company.blockedAt ? "Débloquer l'entreprise" : "Bloquer l'entreprise"}
                     </span>
                  </Button>

                  <Button size={'sm'} variant={'destructive'} onClick={() => deleteDialogRef.current?.open()}>
                     <Trash2Icon className='size-4' />
                     <span className='hidden md:block'>Supprimer l&apos;entreprise</span>
                  </Button>
               </div>
            </CardContent>
         </Card>

         <DeleteCompanyDialog ref={deleteDialogRef} company={company} onCompleted={() => router.back()} />
         <BlockCompanyDialog ref={blockDialogRef} company={company} />
      </>
   )
}

export default CompanyInfo
