'use client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import env from '@/lib/env/client'
import { UploadedFile } from '@/lib/helper-types'
import { compactNumber, getVideoMetadata } from '@/lib/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import { PlayIcon, RefreshCcwIcon, Trash2Icon, XIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useMemo, useState } from 'react'
import { createBunnyTusCredentialsAction, deleteFileAction } from './actions'

type BunnyTusCredentials = {
   libraryId: number
   videoId: string
   signature: string
   expire: number // UNIX timestamp seconds
   title?: string
   collection?: string
   thumbnailTime?: number
}

type Props = {
   file: File
   filePath?: string
   onUploaded: (file: UploadedFile) => void
   onDeleted: VoidFunction
}

export function SelectVideoTusItem({ file, onDeleted, onUploaded, filePath }: Props) {
   const [isPlaying, setIsPlaying] = useState(false)
   const [progress, setProgress] = useState<number>(0)
   const [error, setError] = useState<string | null>(null)

   const isVideo = useMemo(() => file.type.startsWith('video/'), [file])

   const { execute, isPending: isDeleting } = useAction(deleteFileAction, {
      onSuccess({ data }) {
         if (data.success) {
            onDeleted()
         }
      },
      onError(error) {
         console.log('Delete file error => ', error)
      },
   })

   const { mutate: uploadVideo, isPending: isUploadingVideo } = useMutation({
      mutationFn: async (creds: BunnyTusCredentials) => {
         try {
            if (!isVideo) {
               throw new Error('Seules les vidéos sont supportées par cet uploader')
            }

            if (filePath) return true

            const videoDimensions = await getVideoMetadata(file)

            const tusModule: any = await import('tus-js-client')
            const Upload = tusModule?.Upload || tusModule

            await new Promise<void>((resolve, reject) => {
               const upload = new Upload(file, {
                  endpoint: 'https://video.bunnycdn.com/tusupload',
                  retryDelays: [0, 3000, 5000, 10000, 20000, 60000, 60000],
                  headers: {
                     AuthorizationSignature: creds.signature,
                     AuthorizationExpire: creds.expire,
                     VideoId: creds.videoId,
                     LibraryId: creds.libraryId,
                  },
                  metadata: {
                     filetype: file.type,
                     title: creds.title ?? file.name,
                     ...(creds.collection ? { collection: creds.collection } : {}),
                     ...(typeof creds.thumbnailTime === 'number' ? { thumbnailTime: String(creds.thumbnailTime) } : {}),
                  },
                  onError: function (error: Error) {
                     reject(error)
                  },
                  onProgress: function (bytesUploaded: number, bytesTotal: number) {
                     const percentCompleted = bytesTotal ? Math.round((bytesUploaded * 100) / bytesTotal) : 0
                     setProgress(percentCompleted)
                  },
                  onSuccess: function (response: any) {
                     resolve()
                     console.log('Bunny response : ', response)
                  },
               })

               upload.findPreviousUploads().then(function (previousUploads: any[]) {
                  if (previousUploads.length) {
                     upload.resumeFromPreviousUpload(previousUploads[0])
                  }
                  upload.start()
               })
            })

            onUploaded({
               name: file.name,
               url: `https://player.mediadelivery.net/embed/${env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${creds.videoId}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`,
               type: file.type,
               size: file.size,
               metadata: {
                  width: videoDimensions?.width || 0,
                  height: videoDimensions?.height || 0,
                  duration: videoDimensions?.duration || 0,
                  aspectRatio: videoDimensions?.ratio || '16:9',
               },
            })
         } catch (e) {
            const message = (e as Error)?.message || "Une erreur est survenue lors de l'upload de la vidéo"
            setError(message)
         }

         return true
      },
   })

   const { execute: createBunnyCredentials, isPending: isCreatingBunnyCredentials } = useAction(
      createBunnyTusCredentialsAction,
      {
         onSuccess: async ({ data }) => {
            if (!data.success) return

            uploadVideo(data.credentials)
         },
         onError(error) {
            console.log('Get Bunny credentials error => ', error)
         },
      },
   )

   const { isLoading, refetch, isRefetching } = useQuery({
      queryKey: ['post-video-upload-tus', file.name, file.size],
      queryFn: () => {
         createBunnyCredentials({ title: file.name })
         return true
      },
   })

   const handleRefresh = () => {
      refetch()
      setError(null)
      setProgress(0)
   }

   return (
      <>
         <div className='size-40 aspect-square rounded-lg overflow-hidden border relative bg-accent'>
            {isVideo && (
               <video
                  src={window.URL.createObjectURL(file)}
                  className='w-full h-full object-cover object-center'
                  controls={false}
               />
            )}
            <div className='bg-background/50 p-2 absolute bottom-0 left-0 right-0 backdrop-blur-lg space-y-1 border-t'>
               <p className='text-xs font-medium line-clamp-1'>{file.name}</p>
               <p className='text-[10px]'>{compactNumber(file.size)}o</p>
               {(isLoading || isRefetching || isCreatingBunnyCredentials || isUploadingVideo) && (
                  <Progress value={progress} className='w-full' />
               )}
            </div>
            <div className='absolute top-2 right-2 flex gap-1'>
               {!!error && (
                  <Button
                     type='button'
                     variant='ghost'
                     size='icon-sm'
                     onClick={handleRefresh}
                     className='backdrop-blur-lg text-primary hover:text-primary/80'
                  >
                     <RefreshCcwIcon />
                  </Button>
               )}
               {filePath && (
                  <Button
                     type='button'
                     variant='ghost'
                     size='icon-sm'
                     onClick={() => execute({ filePath })}
                     disabled={isDeleting}
                     className='backdrop-blur-lg text-red-500 hover:text-red-500/80'
                  >
                     {isDeleting ? <Spinner /> : <Trash2Icon />}
                  </Button>
               )}
            </div>
            {isVideo && (!isUploadingVideo || !isLoading || !isRefetching || !isCreatingBunnyCredentials) && (
               <Button
                  size='icon-sm'
                  className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer'
                  onClick={() => setIsPlaying((s) => !s)}
               >
                  <PlayIcon className='fill-current' />
               </Button>
            )}
            {(isLoading || isRefetching || isCreatingBunnyCredentials || isUploadingVideo) && (
               <div className='absolute inset-0 bg-background/50 flex items-center justify-center'>
                  <Spinner />
               </div>
            )}
            {error && (
               <div className='absolute top-0 left-0 right-0 bg-black/70 backdrop-blur-lg text-red-500 text-xs p-1 w-3/4 rounded-br-md z-10'>
                  {error}
               </div>
            )}
         </div>
         {isPlaying && (
            <div
               style={{ backdropFilter: 'blur(10px)', zIndex: 888 }}
               className='fixed inset-0 bg-black/50 flex items-center justify-center flex-col p-4'
            >
               <div className='flex justify-end w-full max-w-[800px] py-2'>
                  <Button
                     size='icon-sm'
                     variant='ghost'
                     className='backdrop-blur-lg text-primary hover:text-primary/80'
                     onClick={() => setIsPlaying(false)}
                  >
                     <XIcon />
                  </Button>
               </div>
               <video
                  src={window.URL.createObjectURL(file)}
                  className='w-full max-w-[800px] h-auto object-contain object-center aspect-video'
                  controls
                  autoPlay
                  muted
                  loop
               />
            </div>
         )}
      </>
   )
}

export default SelectVideoTusItem
