'use client'

import EmptyContent from '@/components/base/empty-content'
import UserAvatar from '@/components/base/user-avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserModel } from '@/services/user-service'
import { CircleSlash2Icon } from 'lucide-react'

type Props = {
   users: UserModel[]
}

const CompanyReliableUsers = ({ users }: Props) => {

   return (
      <Card>
         <CardHeader>
            <CardTitle>Utilisateurs fiables de l&apos;entreprise</CardTitle>
            <CardDescription>Liste des utilisateurs vérifiés associés à cette entreprise.</CardDescription>
         </CardHeader>
         <CardContent>
            {users.length === 0 ? (
               <EmptyContent text='Aucun utilisateur fiable trouvé' />
            ) : (
               <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {users.map((user) => (
                     <div key={user.id} className='flex items-center gap-3 p-3 border rounded-lg'>
                        <div className='size-12 shrink-0 relative'>
                           <UserAvatar user={user} className='size-12' />
                           {user.blockedAt && (
                              <div className='size-4 absolute bottom-0 -right-1 bg-primary text-white rounded-full flex items-center justify-center'>
                                 <CircleSlash2Icon className='size-3' />
                              </div>
                           )}
                        </div>
                        <div className='flex flex-col'>
                           <div className='flex items-center gap-2'>
                              <span className='font-medium'>{user.displayName}</span>
                              {user.verifiedAt && (
                                 <Badge variant='outline' className='text-green-600 border-green-500/30'>
                                    Vérifié
                                 </Badge>
                              )}
                           </div>
                           <span className='text-sm text-muted-foreground'>{user.email}</span>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </CardContent>
      </Card>
   )
}

export default CompanyReliableUsers


