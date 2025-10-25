'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { FileType } from '@/lib/helper-types'
import { cn, compactNumber, MAX_FILE_SIZE } from '@/lib/utils'
import { PostModel, PostType } from '@/services/post-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon, TagIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { createPostFormSchema, defaultCreatePostFormValue, type CreatePostFormSchema } from './schema'
import SelectImage, { SelectImageRef } from './select-image'
import useEditPost from './use-edit-post'

type Props = {
   post?: PostModel
}

export default function CreatePostForm({ post }: Props) {
   const selectImageRef = useRef<SelectImageRef>(null)

   const { createPost, updatePost, isLoading } = useEditPost()
   const router = useRouter()

   const form = useForm<CreatePostFormSchema>({
      resolver: zodResolver(createPostFormSchema),
      defaultValues: post
         ? {
              title: post.title,
              description: post.description,
              type: post.type,
              mediaType: post.mediaType || undefined,
              medias: post.medias
                 ? post.medias.map((media) => ({
                      name: media.name,
                      type: media.type,
                      url: media.url,
                      size: media.size,
                      thumbnailUrl: media.thumbnailUrl || undefined,
                      alt: media.alt || undefined,
                      metadata: media.metadata
                         ? {
                              width: media.metadata.width || undefined,
                              height: media.metadata.height || undefined,
                              duration: media.metadata.duration || undefined,
                              aspectRatio: media.metadata.aspectRatio || undefined,
                           }
                         : undefined,
                   }))
                 : undefined,
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

   const mediaType = form.watch('mediaType')

   return (
      <Card>
         <CardContent>
            <Form {...form}>
               <form onSubmit={onSubmit} className='space-y-10'>
                  <div className='grid gap-4'>
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
                        name='mediaType'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='text-sm font-medium'>Type de média</FormLabel>
                              <Tabs
                                 value={field.value}
                                 onValueChange={(val) => {
                                    field.onChange(val)
                                    selectImageRef.current?.resetFiles()
                                 }}
                              >
                                 <TabsList className='bg-background border'>
                                    <TabsTrigger value='image' className='px-4'>
                                       Images
                                    </TabsTrigger>
                                    <TabsTrigger value='video' className='px-4'>
                                       Video
                                    </TabsTrigger>
                                 </TabsList>
                              </Tabs>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name='medias'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='text-sm font-medium'>
                                 Image à joindre sur le post (nombre de fichier au maximum{' '}
                                 {mediaType === 'image' ? 5 : 1})
                              </FormLabel>
                              <FormControl>
                                 <SelectImage
                                    ref={selectImageRef}
                                    value={field.value || []}
                                    onValueChange={field.onChange}
                                    allowedTypes={[mediaType === 'image' ? FileType.IMAGE : FileType.VIDEO]}
                                    title={
                                       mediaType === 'image'
                                          ? 'Image à joindre sur le post (maximum une image, facultatif)'
                                          : 'Video à joindre sur le post (maximum une video, facultatif)'
                                    }
                                    message={
                                       mediaType === 'image'
                                          ? `Supportés: Images (max ${compactNumber(MAX_FILE_SIZE)}o par fichier)`
                                          : `Supportés: Videos (max ${compactNumber(MAX_FILE_SIZE)}o par fichier)`
                                    }
                                    maxFiles={mediaType === 'image' ? 5 : 1}
                                    className='max-w-xl'
                                 />
                              </FormControl>
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
