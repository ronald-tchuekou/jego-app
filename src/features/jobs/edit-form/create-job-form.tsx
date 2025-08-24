'use client'

import { IconInput } from '@/components/base/icon-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import SelectDate from '@/components/ui/select-date'
import { Textarea } from '@/components/ui/textarea'
import FileUploader from '@/features/posts/edit-form/upload-post-image'
import { cn } from '@/lib/utils'
import { JobModel } from '@/services/job-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { BuildingIcon, FileText, LinkIcon, LoaderIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'
import { DateTime } from 'luxon'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createJobFormSchema, defaultCreateJobFormValue, type CreateJobFormSchema } from './schema'
import useEditJob from './use-edit-job'

type Props = {
   job?: JobModel
}

export default function CreateJobForm({ job }: Props) {
   const { createJob, updateJob, isLoading } = useEditJob()
   const router = useRouter()

   const form = useForm<CreateJobFormSchema>({
      resolver: zodResolver(createJobFormSchema),
      defaultValues: job
         ? {
              title: job.title,
              description: job.description,
              companyName: job.companyName || '',
              companyLogo: job.companyLogo || undefined,
              companyWebsite: job.companyWebsite || '',
              companyEmail: job.companyEmail || '',
              companyPhone: job.companyPhone || '',
              companyAddress: job.companyAddress || '',
              companyCity: job.companyCity || '',
              companyState: job.companyState || '',
              companyZip: job.companyZip || '',
              companyCountry: job.companyCountry || '',
              expiresAt: job.expiresAt ? DateTime.fromISO(job.expiresAt).toJSDate() : undefined,
           }
         : defaultCreateJobFormValue,
   })

   const onSubmit = form.handleSubmit((data) => {
      const body = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== ''))

      if (job) {
         updateJob({ jobId: job.id, ...body })
      } else {
         createJob(body)
      }
   })

   return (
      <Card>
         <CardContent>
            <Form {...form}>
               <form onSubmit={onSubmit} className='space-y-6'>
                  <div className='grid gap-4'>
                     {/* Job Information */}
                     <div className='space-y-4'>
                        <h3 className='text-lg font-semibold'>Informations du poste</h3>

                        <FormField
                           control={form.control}
                           name='title'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className='text-sm font-medium'>Titre du poste</FormLabel>
                                 <FormControl>
                                    <IconInput
                                       {...field}
                                       type='text'
                                       placeholder='Entrez le titre du poste'
                                       icon={FileText}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name='description'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className='text-sm font-medium'>Description</FormLabel>
                                 <FormControl>
                                    <Textarea
                                       {...field}
                                       placeholder='Entrez la description du poste'
                                       className='min-h-[120px] resize-none'
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name='expiresAt'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className='text-sm font-medium'>Date d'expiration (optionnel)</FormLabel>
                                 <FormControl>
                                    <SelectDate {...field} placeholder={"Sélectionnez une date d'expiration"} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* Company Information */}
                     <div className='space-y-4 border-t pt-4'>
                        <h3 className='text-lg font-semibold'>Informations de l'entreprise (optionnel)</h3>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                           <FormField
                              control={form.control}
                              name='companyLogo'
                              render={({ field }) => (
                                 <FormItem className='md:col-span-2'>
                                    <FormLabel className='text-sm font-medium'>
                                       Logo de l'entreprise (facultatif)
                                    </FormLabel>
                                    <FormControl>
                                       <FileUploader value={field.value} onValueChange={field.onChange} />
                                    </FormControl>
                                 </FormItem>
                              )}
                           />

                           <FormField
                              control={form.control}
                              name='companyName'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel className='text-sm font-medium'>Nom de l'entreprise</FormLabel>
                                    <FormControl>
                                       <IconInput
                                          {...field}
                                          type='text'
                                          placeholder={"Nom de l'entreprise"}
                                          icon={BuildingIcon}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <FormField
                              control={form.control}
                              name='companyEmail'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel className='text-sm font-medium'>Email de l'entreprise</FormLabel>
                                    <FormControl>
                                       <IconInput
                                          {...field}
                                          type='email'
                                          placeholder='email@entreprise.com'
                                          icon={MailIcon}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <FormField
                              control={form.control}
                              name='companyWebsite'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel className='text-sm font-medium'>Site web</FormLabel>
                                    <FormControl>
                                       <IconInput
                                          {...field}
                                          type='url'
                                          placeholder={'https://www.entreprise.com'}
                                          icon={LinkIcon}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <FormField
                              control={form.control}
                              name='companyPhone'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel className='text-sm font-medium'>Téléphone</FormLabel>
                                    <FormControl>
                                       <IconInput
                                          {...field}
                                          type='tel'
                                          placeholder='+237 623 445 267'
                                          icon={PhoneIcon}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>

                        <FormField
                           control={form.control}
                           name='companyAddress'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className='text-sm font-medium'>Adresse</FormLabel>
                                 <FormControl>
                                    <IconInput
                                       {...field}
                                       type='text'
                                       placeholder='123 Rue de la Paix'
                                       icon={MapPinIcon}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                           <FormField
                              control={form.control}
                              name='companyCity'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel className='text-sm font-medium'>Ville</FormLabel>
                                    <FormControl>
                                       <Input {...field} type='text' placeholder='Paris' />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <FormField
                              control={form.control}
                              name='companyState'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel className='text-sm font-medium'>État/Région</FormLabel>
                                    <FormControl>
                                       <Input {...field} type='text' placeholder='Île-de-France' />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <FormField
                              control={form.control}
                              name='companyZip'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel className='text-sm font-medium'>Code postal</FormLabel>
                                    <FormControl>
                                       <Input {...field} type='text' placeholder='75001' />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <FormField
                              control={form.control}
                              name='companyCountry'
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel className='text-sm font-medium'>Pays</FormLabel>
                                    <FormControl>
                                       <Input {...field} type='text' placeholder='France' />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>
                  </div>

                  <div className='flex gap-4'>
                     <Button type='button' variant='outline' onClick={() => router.back()} disabled={isLoading}>
                        Annuler
                     </Button>
                     <Button type='submit' className='relative' disabled={isLoading}>
                        <LoaderIcon
                           className={cn('animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', {
                              'opacity-0': !isLoading,
                           })}
                        />
                        <span className={cn({ 'opacity-0': isLoading })}>{job ? 'Modifier' : 'Créer'}</span>
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   )
}
