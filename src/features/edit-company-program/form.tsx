'use client'

import { TimePicker } from '@/components/base/time-picker'
import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { editCompanyProgramDefaultValues, EditCompanyProgramSchema, editCompanyProgramSchema } from './schema'
import useUpdateCompanyProgram from './use-update-company-program'

const EditCompanyProgramForm = () => {
   const { auth } = useAuth()
   const company = auth?.user.company

   const { updateCompany, isPending } = useUpdateCompanyProgram()

   const form = useForm<EditCompanyProgramSchema>({
      resolver: zodResolver(editCompanyProgramSchema),
      defaultValues: editCompanyProgramDefaultValues,
   })

   const handleSubmit = form.handleSubmit((data) => {
      updateCompany(data)
   })

   useEffect(() => {
      const data = {
         Lundi: {
            open: company?.dailyProgram?.Lundi?.open || '',
            close: company?.dailyProgram?.Lundi?.close || '',
         },
         Mardi: {
            open: company?.dailyProgram?.Mardi?.open || '',
            close: company?.dailyProgram?.Mardi?.close || '',
         },
         Mercredi: {
            open: company?.dailyProgram?.Mercredi?.open || '',
            close: company?.dailyProgram?.Mercredi?.close || '',
         },
         Jeudi: {
            open: company?.dailyProgram?.Jeudi?.open || '',
            close: company?.dailyProgram?.Jeudi?.close || '',
         },
         Vendredi: {
            open: company?.dailyProgram?.Vendredi?.open || '',
            close: company?.dailyProgram?.Vendredi?.close || '',
         },
         Samedi: {
            open: company?.dailyProgram?.Samedi?.open || '',
            close: company?.dailyProgram?.Samedi?.close || '',
         },
         Dimanche: {
            open: company?.dailyProgram?.Dimanche?.open || '',
            close: company?.dailyProgram?.Dimanche?.close || '',
         },
      }
      form.reset(data)
   }, [company])

   return (
      <Form {...form}>
         <Card>
            <CardHeader>
               <CardTitle>Horaires d&apos;ouverture de l&apos;entreprise</CardTitle>
               <CardDescription>
                  Définissez les horaires d&apos;ouverture et de fermeture pour chaque jour de la semaine. Laissez vide
                  si fermé ce jour-là.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit}>
                  <div className='grid grid-cols-2 gap-6'>
                     {/* Monday */}
                     <div className='space-y-3 border rounded-lg p-3'>
                        <h4 className='font-medium'>Lundi</h4>
                        <div className='grid grid-cols-2 gap-4'>
                           <FormField
                              control={form.control}
                              name='Lundi.open'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Ouverture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name='Lundi.close'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Fermeture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>

                     {/* Tuesday */}
                     <div className='space-y-3 border rounded-lg p-3'>
                        <h4 className='font-medium'>Mardi</h4>
                        <div className='grid grid-cols-2 gap-4'>
                           <FormField
                              control={form.control}
                              name='Mardi.open'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Ouverture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name='Mardi.close'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Fermeture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>

                     {/* Wednesday */}
                     <div className='space-y-3 border rounded-lg p-3'>
                        <h4 className='font-medium'>Mercredi</h4>
                        <div className='grid grid-cols-2 gap-4'>
                           <FormField
                              control={form.control}
                              name='Mercredi.open'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Ouverture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name='Mercredi.close'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Fermeture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>

                     {/* Thursday */}
                     <div className='space-y-3 border rounded-lg p-3'>
                        <h4 className='font-medium'>Jeudi</h4>
                        <div className='grid grid-cols-2 gap-4'>
                           <FormField
                              control={form.control}
                              name='Jeudi.open'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Ouverture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name='Jeudi.close'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Fermeture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>

                     {/* Friday */}
                     <div className='space-y-3 border rounded-lg p-3'>
                        <h4 className='font-medium'>Vendredi</h4>
                        <div className='grid grid-cols-2 gap-4'>
                           <FormField
                              control={form.control}
                              name='Vendredi.open'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Ouverture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name='Vendredi.close'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Fermeture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>

                     {/* Saturday */}
                     <div className='space-y-3 border rounded-lg p-3'>
                        <h4 className='font-medium'>Samedi</h4>
                        <div className='grid grid-cols-2 gap-4'>
                           <FormField
                              control={form.control}
                              name='Samedi.open'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Ouverture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name='Samedi.close'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Fermeture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>

                     {/* Sunday */}
                     <div className='space-y-3 border rounded-lg p-3'>
                        <h4 className='font-medium'>Dimanche</h4>
                        <div className='grid grid-cols-2 gap-x-4'>
                           <FormField
                              control={form.control}
                              name='Dimanche.open'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Heure d&apos;ouverture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name='Dimanche.close'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Heure de fermeture</FormLabel>
                                    <FormControl>
                                       <TimePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>
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

export default EditCompanyProgramForm
