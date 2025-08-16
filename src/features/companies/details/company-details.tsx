'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { DEFAULT_COMPANY_IMAGE } from '@/lib/constants'
import env from '@/lib/env/client'
import { companyKey } from '@/lib/query-kyes'
import { cn, formatDate } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { BanIcon, CheckCircleIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { getCompanyByIdAction } from '../actions'
import { BlockCompanyDialog, DeleteCompanyDialog } from '../list/company-item-actions'

type Props = {
   companyId: string
}

const CompanyDetails = ({ companyId }: Props) => {
   const deleteDialogRef = useRef<{ open: VoidFunction }>(null)
   const blockDialogRef = useRef<{ open: VoidFunction }>(null)

   const router = useRouter()

   const { data, isLoading } = useQuery({
      queryKey: companyKey.detail(companyId),
      async queryFn({ queryKey }) {
         const companyId = queryKey[2]
         const result = await getCompanyByIdAction({ companyId })

         if (result.serverError) throw new Error(result.serverError)

         return result.data
      },
   })

   if (isLoading) return <LoaderContent />

   if (!data) return <EmptyContent />

   const initials = data.name.charAt(0).toUpperCase()
   const companyLogo = data?.logo ? `${env.NEXT_PUBLIC_API_URL}/v1/${data?.logo}` : DEFAULT_COMPANY_IMAGE

   return (
      <>
         <div className='flex flex-col gap-6 max-w-5xl'>
            <Card>
               <CardHeader>
                  <CardTitle>Information de l&apos;entreprise</CardTitle>
                  <CardDescription>{null}</CardDescription>
               </CardHeader>

               <CardContent className='space-y-4'>
                  <Avatar className='size-32 border-2 border-primary'>
                     <AvatarImage src={companyLogo} alt={data?.name} />
                     <AvatarFallback className='text-2xl'>{initials}</AvatarFallback>
                  </Avatar>

                  <div className='border rounded-lg overflow-hidden'>
                     <Table>
                        <TableBody>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Nom de l&apos;entreprise :</TableCell>
                              <TableCell className='font-bold'>{data?.name}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Email :</TableCell>
                              <TableCell className='font-bold'>{data?.email || '- - -'}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Téléphone :</TableCell>
                              <TableCell className='font-bold'>{data?.phone || '- - -'}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Adresse :</TableCell>
                              <TableCell className='font-bold'>{data?.address || '- - -'}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Ville :</TableCell>
                              <TableCell className='font-bold'>{data?.city || '- - -'}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>État/Province :</TableCell>
                              <TableCell className='font-bold'>{data?.state || '- - -'}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Code postal :</TableCell>
                              <TableCell className='font-bold'>{data?.zip_code || '- - -'}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Pays :</TableCell>
                              <TableCell className='font-bold'>{data.country || '- - -'}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Site web :</TableCell>
                              <TableCell className='font-bold'>
                                 {data?.website ? (
                                    <a
                                       href={data.website}
                                       target='_blank'
                                       rel='noopener noreferrer'
                                       className='text-primary hover:underline'
                                    >
                                       {data.website}
                                    </a>
                                 ) : (
                                    '- - -'
                                 )}
                              </TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Description :</TableCell>
                              <TableCell className='font-bold whitespace-normal'>
                                 {data?.description || '- - -'}
                              </TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Catégorie :</TableCell>
                              <TableCell className='font-bold'>{data?.category?.name || '- - -'}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Statut de vérification :</TableCell>
                              <TableCell className={cn('font-bold')}>
                                 <div
                                    className={cn('font-bold flex items-center gap-2', {
                                       'text-green-500': data?.verifiedAt,
                                       'text-orange-500': !data?.verifiedAt,
                                    })}
                                 >
                                    {data?.verifiedAt ? (
                                       <CheckCircleIcon className='size-4 text-green-500' />
                                    ) : (
                                       <BanIcon className='size-4 text-orange-500' />
                                    )}
                                    {data?.verifiedAt ? 'Vérifiée' : 'Non vérifiée'}
                                 </div>
                              </TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Statut :</TableCell>
                              <TableCell
                                 className={cn('font-bold', {
                                    'text-red-500': data?.blockedAt,
                                    'text-green-500': !data?.blockedAt,
                                 })}
                              >
                                 {data?.blockedAt ? 'Bloquée' : 'Active'}
                              </TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Nombre d&apos;utilisateurs :</TableCell>
                              <TableCell className='font-bold'>{data?.users?.length || 0}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Nombre de posts :</TableCell>
                              <TableCell className='font-bold'>{data?.posts?.length || 0}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Nombre de services :</TableCell>
                              <TableCell className='font-bold'>{data?.services?.length || 0}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Date de création :</TableCell>
                              <TableCell className='font-bold'>{formatDate(data?.createdAt)}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Dernière mise à jour :</TableCell>
                              <TableCell className='font-bold'>{formatDate(data?.updatedAt)}</TableCell>
                           </TableRow>
                        </TableBody>
                     </Table>
                  </div>

                  <div className='flex gap-3'>
                     <Button
                        size={'sm'}
                        variant={'outline'}
                        className={cn({
                           'text-green-500': data?.blockedAt,
                           'text-red-500': !data?.blockedAt,
                        })}
                        onClick={() => blockDialogRef.current?.open()}
                     >
                        {data?.blockedAt ? <CheckCircleIcon className='size-4' /> : <BanIcon className='size-4' />}
                        {data?.blockedAt ? "Débloquer l'entreprise" : "Bloquer l'entreprise"}
                     </Button>

                     <Button size={'sm'} variant={'destructive'} onClick={() => deleteDialogRef.current?.open()}>
                        <Trash2Icon className='size-4' />
                        Supprimer l&apos;entreprise
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>

         <DeleteCompanyDialog ref={deleteDialogRef} company={data} onCompleted={() => router.back()} />
         <BlockCompanyDialog ref={blockDialogRef} company={data} />
      </>
   )
}

export default CompanyDetails
