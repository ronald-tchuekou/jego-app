import { Button } from '@/components/ui/button'
import {
   Credenza,
   CredenzaBody,
   CredenzaContent,
   CredenzaDescription,
   CredenzaHeader,
   CredenzaTitle,
} from '@/components/ui/credenza'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { categoryKey } from '@/lib/query-kyes'
import { cn } from '@/lib/utils'
import { CategoryModel } from '@/services/category-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import React, { useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createCategoryAction, updateCategoryAction } from '../../actions'
import { defaultEditCategoryValue, editCategorySchema, EditCategorySchema } from './schema'

export type EditCategoryModalRef = {
   open: (category?: CategoryModel) => void
}

type Props = {
   ref: React.Ref<EditCategoryModalRef>
}

function EditCategoryModal({ ref }: Props) {
   const queryClient = useQueryClient()

   const [category, setCategory] = React.useState<CategoryModel>()
   const [open, setOpen] = React.useState(false)

   const form = useForm<EditCategorySchema>({
      resolver: zodResolver(editCategorySchema),
      defaultValues: defaultEditCategoryValue,
   })

   const { isPending: isCreating, execute: createCategory } = useAction(createCategoryAction, {
      onSuccess() {
         queryClient.invalidateQueries({ queryKey: categoryKey.lists() }).then()
         toast.success('Catégorie ajoutée avec succès.')
         closeModal()
      },
      onError({ error }) {
         console.error('Error when creating a category: ', error)
         toast.error(error.serverError || 'Une erreur est survenue', {
            duration: 8000,
         })
      },
   })

   const { isPending: isUpdating, execute: updateCategory } = useAction(updateCategoryAction, {
      onSuccess() {
         queryClient.invalidateQueries({ queryKey: categoryKey.lists() }).then()
         toast.success('Catégorie modifiée avec succès.')
         closeModal()
      },
      onError({ error }) {
         console.error('Error when updating a category: ', error)
         toast.error(error.serverError || 'Une erreur est survenue', {
            duration: 8000,
         })
      },
   })

   const closeModal = () => {
      setOpen(false)
      setCategory(undefined)
   }

   const submit = form.handleSubmit((data) => {
      if (category) {
         updateCategory({ id: category.id, ...data })
      } else {
         createCategory(data)
      }
   })

   useImperativeHandle(ref, () => ({
      open(category) {
         setCategory(category)
         setOpen(true)
         form.reset(
            category
               ? {
                    id: category.id,
                    name: category.name,
                    description: category.description || undefined,
                 }
               : defaultEditCategoryValue,
         )
      },
   }))

   return (
      <Credenza
         open={open}
         onOpenChange={(val) => {
            if (!val) closeModal()
         }}
      >
         <CredenzaContent>
            <CredenzaHeader>
               <CredenzaTitle>{category ? 'Modifier la catégorie' : 'Ajouter une nouvelle catégorie'}</CredenzaTitle>
               <CredenzaDescription>Les catégories sont utilisées pour organiser les entreprises.</CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody>
               <Form {...form}>
                  <form onSubmit={submit} className={'grid gap-5'}>
                     <FormField
                        control={form.control}
                        name={'name'}
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Libelle de la catégorie</FormLabel>
                              <FormControl>
                                 <Input {...field} placeholder={'Libelle'} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name={'description'}
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Description de la catégorie</FormLabel>
                              <FormControl>
                                 <Textarea {...field} rows={5} placeholder={'Description'} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <div className={'flex justify-between items-center'}>
                        <Button
                           type={'button'}
                           variant={'secondary'}
                           onClick={closeModal}
                           disabled={isCreating || isUpdating}
                        >
                           ANNULER
                        </Button>
                        <Button type={'submit'} disabled={isCreating || isUpdating} className='relative'>
                           <span className={cn({ 'opacity-0': isCreating || isUpdating })}>ENREGISTRER</span>
                           <LoaderIcon
                              className={cn(
                                 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin',
                                 { 'opacity-0': !isCreating && !isUpdating },
                              )}
                           />
                        </Button>
                     </div>
                  </form>
                  <div className={'h-10 md:hidden'} />
               </Form>
            </CredenzaBody>
         </CredenzaContent>
      </Credenza>
   )
}

export default EditCategoryModal
