import env from '@/lib/env/client'
import fetchHelper from '@/lib/helpers/fetch-helper'
import { cn } from '@/lib/utils'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import { useCallback, useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

type Props = {
   maxFiles?: number
   value: string[]
   onValueChange: (files: string[]) => void
}

function FileUploader({ maxFiles = 1, value, onValueChange }: Props) {
   const [files, setFiles] = useState<any[]>(
      value.map((item) => ({ file: { source: item, options: { type: 'local' } } }))
   )

   const processFilesHandler = useCallback(() => {
      onValueChange(files.map((item) => item.serverId))
   }, [onValueChange, value])

   return (
      <div className='max-w-[500px]'>
         <FilePond
            files={files.map((item) => item.file)}
            onupdatefiles={setFiles}
            onprocessfiles={processFilesHandler}
            onremovefile={(error, file) => {
               if (error) {
                  console.log('Error when removing the file: ', error)
                  return
               }
               onValueChange(value.filter((v) => v !== file.source))
            }}
            allowMultiple={true}
            maxFiles={maxFiles}
            server={{
               url: `${env.NEXT_PUBLIC_API_URL}/v1/files`,
               process: {
                  url: `/upload-single`,
                  method: 'POST',
               },
               load: '/load?filePath=',
               revert: async (source, load, error) => {
                  const { error: errorResponse } = await fetchHelper(`/files/revert?filePath=${source}`, {
                     method: 'DELETE',
                  })

                  if (errorResponse) {
                     error(errorResponse)
                     return
                  }

                  load()
               },
            }}
            name='files'
            credits={false}
            className={cn('bg-accent rounded-lg !m-0 !mb-0')}
            labelIdle='Glisser et déposez vos fichiers ou <span class="filepond--label-action">Parcourir</span>'
         />
      </div>
   )
}

export default FileUploader
