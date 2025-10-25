import { Button } from '@/components/ui/button'
import { FileType, UploadedFile } from '@/lib/helper-types'
import { cn, compactNumber, MAX_FILE_SIZE } from '@/lib/utils'
import { PlusIcon, UploadIcon } from 'lucide-react'
import { Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import SelectImageItem from './select-image-item'

export type SelectImageRef = {
   resetFiles: VoidFunction
}

type Props = {
   value?: UploadedFile[]
   onValueChange: (files: UploadedFile[]) => void
   maxFiles?: number
   allowedTypes: FileType[]
   title?: string
   message?: string
   className?: string
   ref?: Ref<SelectImageRef>
}

export function SelectImage({ value, onValueChange, maxFiles = 4, allowedTypes, title, message, className, ref }: Props) {
   const [files, setFiles] = useState<File[]>([])
   const [isDragOver, setIsDragOver] = useState(false)
   const [uploadedFiles, setUploadedFiles] = useState<(UploadedFile|null)[]>(value || [])

   const fileInputRef = useRef<HTMLInputElement>(null)
   const dropZoneRef = useRef<HTMLDivElement>(null)

   const uploadedFilesFromForm = useMemo(() => {
      return value || []
   }, [value])

   const onFilesChange = async (filesList: FileList) => {
      const newFiles = Array.from(filesList).slice(0, maxFiles - files.length)
      const updated = [...files, ...newFiles]

      setFiles(updated)
      setUploadedFiles(updated.map(() => null))
   }

   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
         onFilesChange(e.target.files)
      }

      e.target.value = ''
   }

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(true)
   }

   const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
   }

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
         onFilesChange(e.dataTransfer.files)
      }
   }

   const removeFile = (index: number) => {
      setFiles(files => [...files.slice(0, index), ...files.slice(index + 1)])
      setUploadedFiles(value => [...value.slice(0), ...value.slice(index + 1)])
   }
   
   useImperativeHandle(ref, (() => ({
      resetFiles(){
         setFiles([])
         setUploadedFiles([])
      }
   })))

   useEffect(() => {
      const setCount = uploadedFiles.filter((file) => file?.url).length
      if (files.length === setCount) onValueChange(uploadedFiles as UploadedFile[])
   }, [files, uploadedFiles])

   return (
      <div className={cn('space-y-3', className)}>
         {files.length < maxFiles && (
            <div
               ref={dropZoneRef}
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onDrop={handleDrop}
               className={cn(
                  'relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer',
                  isDragOver
                     ? 'border-primary bg-primary/10 dark:bg-primary/10'
                     : 'hover:border-primary hover:bg-primary/10 dark:hover:bg-primary/10'
               )}
               onClick={() => fileInputRef.current?.click()}
               role='button'
               tabIndex={0}
               aria-label='Upload media files'
               onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                     e.preventDefault()
                     fileInputRef.current?.click()
                  }
               }}
            >
               <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  accept={`${allowedTypes?.includes(FileType.IMAGE) ? 'image/*,' : ''}${
                     allowedTypes?.includes(FileType.VIDEO) ? 'video/*,' : ''
                  }`}
                  onChange={handleFileInputChange}
                  className='absolute inset-0 size-0 opacity-0 cursor-pointer'
                  aria-hidden='true'
               />

               <div className='space-y-4'>
                  <div className='w-16 h-16 bg-accent dark:bg-accent/50 rounded-full flex items-center justify-center mx-auto'>
                     <UploadIcon className='w-8 h-8 text-primary dark:text-primary' />
                  </div>

                  <div>
                     <p className='text-lg font-medium text-foreground mb-2'>
                        {title || 'Glissez et déposez vos fichiers ici ou cliquez pour télécharger'}
                     </p>
                     <p className='text-sm text-muted-foreground'>
                        {message || `Supportés: Images, Videos (max ${compactNumber(MAX_FILE_SIZE)}o par fichier)`}
                     </p>
                  </div>

                  <Button
                     type='button'
                     variant='outline'
                     className='mt-4 border-primary'
                     onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                     }}
                  >
                     <PlusIcon />
                     Choose Files
                  </Button>
               </div>
            </div>
         )}
         {files.length > 0 && (
            <div className='flex flex-wrap gap-4'>
               {files.map((file, index) => (
                  <SelectImageItem
                     filePath={uploadedFilesFromForm[index]?.url}
                     file={file}
                     key={`${file.name}-${index}`}
                     onUploaded={(file) => {
                        console.log('Uploaded file => ', file)
                        setUploadedFiles((state) => [...state.slice(0, index), file, ...state.slice(index + 1)])
                     }}
                     onDeleted={() => removeFile(index)}
                  />
               ))}
            </div>
         )}
      </div>
   )
}

export default SelectImage
