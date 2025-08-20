'use client'

import FileUploader from '@/components/base/file-uploader'
import { IconInput } from '@/components/base/icon-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { postKey } from '@/lib/query-kye'
import { cn } from '@/lib/utils'
import { PostModel, PostType } from '@/services/post-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { FileText, LoaderIcon, TagIcon } from 'lucide-react'
import { HookCallbacks, useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createPostFormAction, updatePostAction } from './actions'
import { createPostFormSchema, defaultCreatePostFormValue, type CreatePostFormSchema } from './schema'

type Props = {
   post?: PostModel
}

export default function CreatePostForm({ post }: Props) {
   const queryClient = useQueryClient()
   const router = useRouter()

   const options: HookCallbacks<any, any, any, any> = {
      onSuccess: ({ data }) => {
         if (data?.success) {
            form.reset(defaultCreatePostFormValue)
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: postKey.all })
            // Redirect to posts list or post detail
            router.back()
         }
      },
      onError: ({ error }) => {
         console.error(error)
         toast.error(error.serverError || "Une erreur est survenue lors de l'édition du post", {
            duration: 8000,
         })
      },
   }

   const form = useForm<CreatePostFormSchema>({
      resolver: zodResolver(createPostFormSchema),
      defaultValues: post
         ? {
              title: post.title,
              description: post.description,
              type: post.type,
              image: post.image || undefined,
              category: post.category,
           }
         : defaultCreatePostFormValue,
   })

   // Create post action
   const { execute: createPost, isPending: isCreating } = useAction(createPostFormAction, options)
   const { execute: updatePost, isPending: isUpdating } = useAction(updatePostAction, options)

   const onSubmit = form.handleSubmit((data) => {
      if (post) {
         updatePost({ postId: post.id, ...data })
      } else {
         createPost(data)
      }
   })

   return (
      <Card>
         <CardContent>
            <Form {...form}>
               <form onSubmit={onSubmit} className='space-y-10'>
                  <div className='grid gap-4'>
                     <FormField
                        control={form.control}
                        name='image'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='text-sm font-medium'>
                                 Image à joindre sur le post (maximum une image, facultatif)
                              </FormLabel>
                              <FormControl>
                                 <FileUploader
                                    maxFiles={6}
                                    value={field.value ? [field.value] : []}
                                    onValueChange={(files) => {
                                       field.onChange(files[0])
                                    }}
                                 />
                              </FormControl>
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name='images'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='text-sm font-medium'>
                                 Images à joindre sur le post (maximum 6 images, facultatif)
                              </FormLabel>
                              <FormControl>
                                 <FileUploader
                                    maxFiles={6}
                                    value={field.value || []}
                                    onValueChange={(files) => {
                                       console.log('Files ==> ', files)
                                       field.onChange(files)
                                    }}
                                 />
                              </FormControl>
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name='type'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='text-sm font-medium'>Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                 <FormControl>
                                    <SelectTrigger>
                                       <div className='flex items-center gap-2'>
                                          <TagIcon className='size-4 text-muted-foreground' />
                                          <SelectValue placeholder='Sélectionnez le type' />
                                       </div>
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value={PostType.NEWS}>Actualité</SelectItem>
                                    <SelectItem value={PostType.EVENT}>Événement</SelectItem>
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='text-sm font-medium'>Titre</FormLabel>
                              <FormControl>
                                 <IconInput
                                    {...field}
                                    type='text'
                                    placeholder='Entrez le titre du post'
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
                                    placeholder='Entrez la description du post'
                                    className='min-h-[120px] resize-none'
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <div className='flex gap-4'>
                     <Button
                        type='button'
                        variant='outline'
                        onClick={() => router.back()}
                        disabled={isCreating || isUpdating}
                     >
                        Annuler
                     </Button>
                     <Button type='submit' className='relative' disabled={isCreating || isUpdating}>
                        <LoaderIcon
                           className={cn('animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', {
                              'opacity-0': !isCreating && !isUpdating,
                           })}
                        />
                        <span className={cn({ 'opacity-0': isCreating || isUpdating })}>Enregistrer</span>
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   )
}
