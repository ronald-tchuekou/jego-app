'use client'

import { IconInput } from '@/components/base/icon-input'
import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon, MapPinIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { editCompanyLocationDefaultValues, EditCompanyLocationSchema, editCompanyLocationSchema } from './schema'
import useUpdateCompanyLocation from './use-update-company-location'

const EditCompanyLocationForm = () => {
   const { auth } = useAuth()
   const company = auth?.user.company

   const { updateCompanyLocation, isPending } = useUpdateCompanyLocation()

   const form = useForm<EditCompanyLocationSchema>({
      resolver: zodResolver(editCompanyLocationSchema),
      defaultValues: editCompanyLocationDefaultValues,
   })

   const handleSubmit = form.handleSubmit((data) => {
      const isSet = data.lat && data.lng

      updateCompanyLocation(
         isSet
            ? {
                 lat: Number(data.lat),
                 lng: Number(data.lng),
              }
            : undefined
      )
   })

   useEffect(() => {
      const data = {
         lat: `${company?.location?.lat || ''}`,
         lng: `${company?.location?.lng || ''}`,
      }

      form.reset(data)
   }, [company])

   return (
      <Form {...form}>
         <Card>
            <CardHeader>
               <CardTitle>Localisation de l&apos;entreprise</CardTitle>
               <CardDescription>Définissez la localisation de l&apos;entreprise.</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit}>
                  <div className='grid grid-cols-2 gap-6'>
                     <FormField
                        control={form.control}
                        name='lat'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Latitude</FormLabel>
                              <FormControl>
                                 <IconInput {...field} icon={MapPinIcon} placeholder='Entrez la latitude' />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name='lng'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Longitude</FormLabel>
                              <FormControl>
                                 <IconInput {...field} icon={MapPinIcon} placeholder='Entrez la longitude' />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <button className='hidden size-0 absolute' type='submit' />
               </form>
            </CardContent>
            <CardFooter>
               <Button
                  disabled={isPending}
                  onClick={handleSubmit}
                  className={cn('relative', {
                     'opacity-50': isPending,
                  })}
               >
                  <LoaderIcon
                     className={cn(
                        'animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 size-5',
                        {
                           'opacity-0': !isPending,
                        }
                     )}
                  />
                  <span
                     className={cn({
                        'opacity-0': isPending,
                     })}
                  >
                     Enregistrer
                  </span>
               </Button>
            </CardFooter>
         </Card>
      </Form>
   )
}

export default EditCompanyLocationForm
