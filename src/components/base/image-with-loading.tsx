'use client'

import env from '@/lib/env/client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
   src: string
   alt: string
   style?: React.CSSProperties
   imageClassName?: string
   className?: string
   fill?: boolean
   sizes?: string
   width?: number
   height?: number
}

export const ImageWithLoading = ({ src, alt, style, imageClassName, className, ...props }: Props) => {
   const [isLoading, setIsLoading] = useState(true)
   const [hasError, setHasError] = useState(false)

   const imageUrl = src.startsWith('http') ? src : `${env.NEXT_PUBLIC_API_URL}/v1/${src}`

   return (
      <div style={style} className={cn('relative w-full h-auto border bg-black', className)}>
         <Image
            src={imageUrl}
            alt={alt}
            className={cn(
               'transition-opacity duration-300 size-full object-contain object-center bg-black',
               imageClassName,
               {
                  'bg-muted animate-pulse': isLoading,
               }
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => {
               setIsLoading(false)
               setHasError(true)
            }}
            {...props}
         />
         {hasError ? (
            <div className='absolute inset-0 bg-muted flex items-center justify-center'>
               <span className='text-muted-foreground text-sm text-center p-4'>
                  Erreur lors du chargement de l&apos;image
               </span>
            </div>
         ) : null}
      </div>
   )
}

export default ImageWithLoading
