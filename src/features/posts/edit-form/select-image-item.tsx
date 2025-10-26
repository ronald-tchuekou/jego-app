import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import env from '@/lib/env/client'
import { UploadedFile } from '@/lib/helper-types'
import { compactNumber, getImageDimensions, getVideoMetadata } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { PlayIcon, RefreshCcwIcon, Trash2Icon, XIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Image from 'next/image'
import { useState } from 'react'
import { deleteFileAction } from './actions'

type Props = {
   file: File
   filePath?: string
   onUploaded: (file: UploadedFile) => void
   onDeleted: VoidFunction
}

export function SelectImageItem({ file, onDeleted, onUploaded, filePath }: Props) {
   const [isPlaying, setIsPlaying] = useState(false)
   const [progress, setProgress] = useState<number>(0)
   const [error, setError] = useState<string | null>(null)

   const isVideo = file.type.startsWith('video/')

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

   const { isLoading, refetch } = useQuery({
      queryKey: ['post-file-upload', file.name, file.size],
      queryFn: async () => {
         try {
            if (filePath) return true;
            
            const formData = new FormData()
            formData.append('files', file)

            const isVideo = file.type.startsWith('video/')

            const imageDimensions = isVideo ? undefined : await getImageDimensions(file)
            const videoDimensions = isVideo ? await getVideoMetadata(file) : undefined

            const result = await axios.post<{
               path: string
               name: string
               type: string
               filename: string
            }>(`${env.NEXT_PUBLIC_API_URL}/v1/files/single`, formData, {
               onUploadProgress: (progressEvent) => {
                  const percentCompleted = !!progressEvent.total
                     ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                     : 0
                  setProgress(percentCompleted)
               },
            })

            if (result.status === 400) {
               const message = (result as any).response.message
               throw new Error(message)
            }

            const dataResponse = result.data

            onUploaded({
               name: file.name,
               url: dataResponse.path,
               type: file.type,
               size: file.size,
               metadata: isVideo
                  ? {
                       width: videoDimensions?.width || 0,
                       height: videoDimensions?.height || 0,
                       duration: videoDimensions?.duration,
                       aspectRatio: videoDimensions?.ratio || '12/9',
                    }
                  : {
                       width: imageDimensions?.width || 0,
                       height: imageDimensions?.height || 0,
                       aspectRatio: imageDimensions?.ratio || '16/9',
                    },
            })

         } catch (error) {
            console.error('Upload file error => ', error)
            if (error instanceof AxiosError) {
               const message = error.response?.data.message || "Une erreur est survenue lors de l'upload du fichier"
               setError(message)
            } else {
               setError((error as Error).message)
            }
         }
         
         return true;
      },
   })

   const handleRefresh = () => {
      refetch()
      setError(null)
   }

   return (
      <>
         <div className='size-40 aspect-square rounded-lg overflow-hidden border relative bg-accent'>
            {isVideo ? (
               <video
                  src={window.URL.createObjectURL(file)}
                  className='w-full h-full object-cover object-center'
                  controls={false}
               />
            ) : (
               <Image
                  src={window.URL.createObjectURL(file)}
                  alt={file.name}
                  width={100}
                  height={100}
                  className='w-full h-full object-cover object-center'
               />
            )}
            <div className='bg-background/50 p-2 absolute bottom-0 left-0 right-0 backdrop-blur-lg space-y-1 border-t'>
               <p className='text-xs font-medium line-clamp-1'>{file.name}</p>
               <p className='text-[10px]'>{compactNumber(file.size)}o</p>
               {isLoading && <Progress value={progress} className='w-full' />}
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
            {isVideo && (
               <Button
                  size='icon-sm'
                  className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer'
                  onClick={() => setIsPlaying((s) => !s)}
               >
                  <PlayIcon className='fill-current' />
               </Button>
            )}
            {isLoading && (
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

export default SelectImageItem
