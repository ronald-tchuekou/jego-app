'use client'

import EmptyContent from '@/components/base/empty-content'
import LoaderContent from '@/components/base/loader-content'
import UserAvatar from '@/components/base/user-avatar'
import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { userKey } from '@/lib/query-kye'
import { cn, formatDate, getRoleLabel } from '@/lib/utils'
import UserService from '@/services/user-service'
import { useQuery } from '@tanstack/react-query'
import { BanIcon, CheckCircleIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { BlockUserDialog, DeleteUserDialog } from '../list/user-item-actions'

type Props = {
   userId: string
}

const UserDetails = ({ userId }: Props) => {
   const { auth } = useAuth()
   const deleteDialogRef = useRef<{ open: VoidFunction }>(null)
   const blockDialogRef = useRef<{ open: VoidFunction }>(null)

   const router = useRouter()

   const { data, isLoading } = useQuery({
      queryKey: userKey.detail(userId),
      async queryFn() {
         if (!auth?.token) {
            throw new Error('Not authenticated')
         }

         const result = await UserService.getUserById(userId, auth.token)
         return result
      },
      enabled: !!auth?.token,
   })

   if (isLoading) return <LoaderContent />

   if (!data) return <EmptyContent />

   return (
      <>
         <div className='flex flex-col gap-6 max-w-5xl'>
            <Card>
               <CardHeader>
                  <CardTitle>Information personnelle</CardTitle>
                  <CardDescription>{null}</CardDescription>
               </CardHeader>

               <CardContent className='space-y-4'>
                  <UserAvatar user={data} className='size-32' />

                  <div className='border rounded-lg overflow-hidden'>
                     <Table>
                        <TableBody>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Nom et prénom :</TableCell>
                              <TableCell className='font-bold'>{data?.displayName}</TableCell>
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
                              <TableCell className='text-muted-foreground'>Code postal :</TableCell>
                              <TableCell className='font-bold'>{data?.zipCode || '- - -'}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Pays :</TableCell>
                              <TableCell className='font-bold'>{data?.country || '- - -'}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Rôle :</TableCell>
                              <TableCell className='font-bold'>{getRoleLabel(data?.role)}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>
                                 Statut de vérification de l&apos;email :
                              </TableCell>
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
                                    {data?.verifiedAt ? 'Vérifié' : 'Non vérifié'}
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
                                 {data?.blockedAt ? 'Bloqué' : 'Actif'}
                              </TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Entreprise :</TableCell>
                              <TableCell className='font-bold'>{data?.company?.name || '- - -'}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Date de création :</TableCell>
                              <TableCell className='font-bold'>{formatDate(data?.createdAt)}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell className='text-muted-foreground'>Date de dernière connexion :</TableCell>
                              <TableCell className='font-bold'>{formatDate(data?.lastLoginAt)}</TableCell>
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
                        {data?.blockedAt ? 'Débloquer le compte' : 'Bloquer le compte'}
                     </Button>

                     <Button size={'sm'} variant={'destructive'} onClick={() => deleteDialogRef.current?.open()}>
                        <Trash2Icon className='size-4' />
                        Supprimer le compte
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>

         <DeleteUserDialog ref={deleteDialogRef} user={data} onCompleted={() => router.back()} />
         <BlockUserDialog ref={blockDialogRef} user={data} />
      </>
   )
}

export default UserDetails
