'use client'

import { IconInput } from '@/components/base/icon-input'
import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building, Globe, LoaderIcon, MapPin, Phone, User } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { updateUserInfoAction } from '../actions'
import { defaultUpdateUserInfoValue, updateUserInfoSchema, type UpdateUserInfoSchema } from './schema'

export default function UpdateUserInfoForm() {
   const { auth, revalidateAuth } = useAuth()
   const user = auth?.user

   const form = useForm<UpdateUserInfoSchema>({
      resolver: zodResolver(updateUserInfoSchema),
      defaultValues: defaultUpdateUserInfoValue,
   })

   const { execute, isPending } = useAction(updateUserInfoAction, {
      onSuccess: ({ data }) => {
         if (data?.success) {
            toast.success(data.message)
            revalidateAuth()
         }
      },
      onError: ({ error }) => {
         toast.error(error.serverError || 'Une erreur est survenue', {
            duration: 8000,
         })
      },
   })

   const onSubmit = (data: UpdateUserInfoSchema) => {
      const filteredData = Object.fromEntries(
         Object.entries(data).filter(([, value]) => value !== null && value !== undefined && value !== ''),
      )
      execute(filteredData as UpdateUserInfoSchema)
   }

   useEffect(() => {
      if (user) {
         form.reset({
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone || '',
            address: user.address || '',
            city: user.city || '',
            state: user.state || '',
            zipCode: user.zipCode || '',
            country: user.country || '',
         })
      }
   }, [user, form])

   return (
      <Card>
         <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
         </CardHeader>

         <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='grid gap-4 md:grid-cols-2'>
                     <FormField
                        control={form.control}
                        name='firstName'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='text-sm font-medium'>Prénom</FormLabel>
                              <FormControl>
                                 <IconInput {...field} placeholder='Entrez votre prénom' icon={User} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name='lastName'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='text-sm font-medium'>Nom</FormLabel>
                              <FormControl>
                                 <IconInput {...field} placeholder='Entrez votre nom' icon={User} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <FormField
                     control={form.control}
                     name='phone'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className='text-sm font-medium'>Téléphone</FormLabel>
                           <FormControl>
                              <IconInput {...field} placeholder='Entrez votre numéro de téléphone' icon={Phone} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='address'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className='text-sm font-medium'>Adresse</FormLabel>
                           <FormControl>
                              <IconInput {...field} placeholder='Entrez votre adresse' icon={MapPin} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <div className='grid gap-4 md:grid-cols-2'>
                     <FormField
                        control={form.control}
                        name='city'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='text-sm font-medium'>Ville</FormLabel>
                              <FormControl>
                                 <IconInput {...field} placeholder='Entrez votre ville' icon={Building} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name='state'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='text-sm font-medium'>État/Province</FormLabel>
                              <FormControl>
                                 <IconInput {...field} placeholder='Entrez votre état/province' icon={Building} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                     <FormField
                        control={form.control}
                        name='zipCode'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='text-sm font-medium'>Code postal</FormLabel>
                              <FormControl>
                                 <IconInput {...field} placeholder='Entrez votre code postal' icon={MapPin} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name='country'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='text-sm font-medium'>Pays</FormLabel>
                              <FormControl>
                                 <IconInput {...field} placeholder='Entrez votre pays' icon={Globe} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <Button type='submit' disabled={isPending || !form.formState.isDirty}>
                     {isPending && <LoaderIcon className='animate-spin' />}
                     <span>Mettre à jour les informations</span>
                  </Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   )
}
