'use client'

import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { editCompanyInfoDefaultValues, EditCompanyInfoSchema, editCompanyInfoSchema } from './schema'
import useUpdateCompany from './use-update-company'

const EditCompanyInfoForm = () => {
   const { auth } = useAuth()
   const company = auth?.user.company

   const {updateCompany, isPending} = useUpdateCompany()

   // Map company data to schema format, handling null values
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
         daily_program: company.daily_program || undefined,
      }
   }

   const form = useForm<EditCompanyInfoSchema>({
      resolver: zodResolver(editCompanyInfoSchema),
      defaultValues: getDefaultValues(),
   })

   const handleSubmit = form.handleSubmit((data) => {
      updateCompany(data)
   })

   return <Form {...form}>
      <Card>
         <CardHeader>
            <CardTitle>Informations de l'entreprise</CardTitle>
            <CardDescription>
               Modifiez les informations de votre entreprise
            </CardDescription>
         </CardHeader>
         <CardContent>
            <form onSubmit={handleSubmit}></form>
         </CardContent>
         <CardFooter>
            <Button disabled={isPending} onClick={handleSubmit} className={cn('relative', {
               'opacity-50': isPending
            })}>
               <LoaderIcon className={cn('animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 size-5', {
                  'opacity-0': !isPending
               })}/>
               <span className={cn({
                  'opacity-0': isPending
               })}>Enregistrer</span>
            </Button>
         </CardFooter>
      </Card>
   </Form>
}

export default EditCompanyInfoForm
