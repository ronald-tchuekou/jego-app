'use client'

import { IconInput } from '@/components/base/icon-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import FileUploader from '@/features/posts/edit-form/upload-post-image'
import { cn } from '@/lib/utils'
import { PostModel, PostType } from '@/services/post-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, LoaderIcon, TagIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createPostFormSchema, defaultCreatePostFormValue, type CreatePostFormSchema } from './schema'
import useEditPost from './use-edit-post'

type Props = {
   post?: PostModel
}

export default function CreatePostForm({ post }: Props) {
   const { createPost, updatePost, isLoading } = useEditPost()
   const router = useRouter()

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
                                 <FileUploader value={field.value} onValueChange={field.onChange} />
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
                     <Button type='button' variant='outline' onClick={() => router.back()} disabled={isLoading}>
                        Annuler
                     </Button>
                     <Button type='submit' className='relative' disabled={isLoading}>
                        <LoaderIcon
                           className={cn('animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', {
                              'opacity-0': !isLoading,
                           })}
                        />
                        <span className={cn({ 'opacity-0': isLoading })}>Enregistrer</span>
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   )
}
