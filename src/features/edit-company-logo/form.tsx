'use client'

import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import env from '@/lib/env/client'
import fetchHelper from '@/lib/helpers/fetch-helper'
import { cn } from '@/lib/utils'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import { LoaderIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import useUpdateCompanyLogo from './use-update-company-logo'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const EditCompanyLogoForm = () => {
   const { auth } = useAuth()
   const company = auth?.user.company

   const { updateCompanyLogo, isPending } = useUpdateCompanyLogo()

   const [logo, setLogo] = useState<string>()

   const handleSubmit = () => {
      if (!logo) return
      updateCompanyLogo(logo)
   }

   useEffect(() => {
      setLogo(company?.logo || undefined)
   }, [company?.logo])

   return (
      <div className='space-y-4 w-full max-w-[500px]'>
         <Label>Logo de l&apos;entreprise</Label>
         <FilePond
            files={logo ? [{ source: logo, options: { type: 'local' } }] : []}
            onprocessfile={(error, file) => {
               if (error) {
                  console.error(error)
                  return
               }
               setLogo(file?.serverId)
            }}
            allowMultiple={false}
            maxFiles={1}
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
         <Button
            disabled={isPending || !logo || logo === company?.logo}
            onClick={handleSubmit}
            className={cn('relative', {
               'opacity-50': isPending,
            })}
         >
            <LoaderIcon
               className={cn(
                  'animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 size-5',
                  {
                     'opacity-0': !isPending,
                  },
               )}
            />
            <span
               className={cn({
                  'opacity-0': isPending,
               })}
            >
               Enregistrer
            </span>
         </Button>
      </div>
   )
}

export default EditCompanyLogoForm
