'use client'

import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { editCompanyInfoDefaultValues, EditCompanyInfoSchema, editCompanyInfoSchema } from './schema'
import useUpdateCompany from './use-update-company'

const EditCompanyInfoForm = () => {
   const { auth } = useAuth()
   const company = auth?.user.company

   const { updateCompany, isPending } = useUpdateCompany()

   const getDefaultValues = (): EditCompanyInfoSchema => {
      if (!company) return editCompanyInfoDefaultValues

      return {
         name: company.name || '',
         email: company.email || '',
         phone: company.phone || '',
         address: company.address || '',
         city: company.city || '',
         state: company.state || '',
         zipCode: company.zipCode || '',
         country: company.country || '',
         website: company.website || '',
         facebook: company.facebook || '',
         instagram: company.instagram || '',
         twitter: company.twitter || '',
         linkedin: company.linkedin || '',
         youtube: company.youtube || '',
         tiktok: company.tiktok || '',
         description: company.description || '',
         location: company.location || undefined,
      }
   }

   const form = useForm<EditCompanyInfoSchema>({
      resolver: zodResolver(editCompanyInfoSchema),
      defaultValues: getDefaultValues(),
   })

   const handleSubmit = form.handleSubmit((data) => {
      const filteredData = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== ''))
      updateCompany(filteredData as EditCompanyInfoSchema)
   })

   return (
      <Form {...form}>
         <Card>
            <CardHeader>
               <CardTitle>Informations de l&apos;entreprise</CardTitle>
               <CardDescription>Modifiez les informations de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* Basic Information */}
                  <div className='space-y-4'>
                     <h3 className='text-lg font-medium text-primary'>Informations de base</h3>
                     <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField
                           control={form.control}
                           name='name'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Nom de l&apos;entreprise *</FormLabel>
                                 <FormControl>
                                    <Input placeholder='Nom de votre entreprise' {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name='email'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Email</FormLabel>
                                 <FormControl>
                                    <Input type='email' placeholder='contact@entreprise.com' {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name='phone'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Téléphone</FormLabel>
                                 <FormControl>
                                    <Input placeholder='+237 623 456 789' {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name='website'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Site web</FormLabel>
                                 <FormControl>
                                    <Input placeholder='https://www.entreprise.com' {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  </div>

                  {/* Address Information */}
                  <div className='space-y-4'>
                     <h3 className='text-lg font-medium text-primary'>Adresse de l&apos;entreprise</h3>
                     <div className='grid grid-cols-1 gap-4'>
                        <FormField
                           control={form.control}
                           name='address'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Adresse</FormLabel>
                                 <FormControl>
                                    <Input placeholder='123 Rue de la Paix' {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                           <FormField
                              control={form.control}
                              name='city'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Ville</FormLabel>
                                    <FormControl>
                                       <Input placeholder='Paris' {...field} />
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
                                    <FormLabel>État/Région</FormLabel>
                                    <FormControl>
                                       <Input placeholder='Île-de-France' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name='zipCode'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Code postal</FormLabel>
                                    <FormControl>
                                       <Input placeholder='75001' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                        <FormField
                           control={form.control}
                           name='country'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Pays</FormLabel>
                                 <FormControl>
                                    <Input placeholder='France' {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  </div>

                  {/* Description */}
                  <div className='space-y-4'>
                     <h3 className='text-lg font-medium text-primary'>Description de l&apos;entreprise</h3>
                     <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Description de l&apos;entreprise *</FormLabel>
                              <FormControl>
                                 <Textarea
                                    placeholder='Décrivez votre entreprise, ses services et sa mission...'
                                    className='min-h-[120px] resize-none'
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  {/* Social Media Links */}
                  <div className='space-y-4'>
                     <h3 className='text-lg font-medium text-primary'>Réseaux sociaux de l&apos;entreprise</h3>
                     <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField
                           control={form.control}
                           name='facebook'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Facebook</FormLabel>
                                 <FormControl>
                                    <Input placeholder='https://www.facebook.com/entreprise' {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name='instagram'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Instagram</FormLabel>
                                 <FormControl>
                                    <Input placeholder='https://www.instagram.com/entreprise' {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name='twitter'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Twitter</FormLabel>
                                 <FormControl>
                                    <Input placeholder='https://www.twitter.com/entreprise' {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name='linkedin'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>LinkedIn</FormLabel>
                                 <FormControl>
                                    <Input placeholder='https://www.linkedin.com/company/entreprise' {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name='youtube'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>YouTube</FormLabel>
                                 <FormControl>
                                    <Input placeholder='https://www.youtube.com/channel/entreprise' {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name='tiktok'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>TikTok</FormLabel>
                                 <FormControl>
                                    <Input placeholder='https://www.tiktok.com/@entreprise' {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
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
                        },
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

export default EditCompanyInfoForm
