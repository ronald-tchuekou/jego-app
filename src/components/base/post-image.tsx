import ImageWithLoading from '@/components/base/image-with-loading'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { MediaModel } from '@/services/media_service'
import { useEffect, useState } from 'react'

type Props = {
   images: MediaModel[]
}

function PostImage({ images }: Props) {
   const imageCount = images.length
   const [api, setApi] = useState<CarouselApi>()
   const [current, setCurrent] = useState(0)

   useEffect(() => {
      if (!api) return

      setCurrent(api.selectedScrollSnap())

      api.on('select', () => {
         setCurrent(api.selectedScrollSnap())
      })
   }, [api])

   if (imageCount === 0) return null

   return (
      <div className='bg-gray-300 dark:bg-gray-600 rounded-lg overflow-hidden border relative'>
         {imageCount === 1 ? (
            <ImageWithLoading
               src={images[0].url}
               alt={images[0].alt || 'Post image'}
               fill={!images[0].metadata?.width || !images[0].metadata?.height}
               width={images[0].metadata?.width || undefined}
               height={images[0].metadata?.height || undefined}
               style={{
                  aspectRatio: images[0].metadata?.aspectRatio?.replace(':', '/') || '16/10',
               }}
            />
         ) : (
            <div className='relative'>
               <Carousel className='w-full' setApi={setApi}>
                  <CarouselContent>
                     {images.map((image, index) => (
                        <CarouselItem key={`${image.id}-${index}`}>
                           <div className='p-1'>
                              <ImageWithLoading
                                 src={image.url}
                                 alt={image.alt || 'Post image'}
                                 fill={!image.metadata?.width || !image.metadata?.height}
                                 width={image.metadata?.width || undefined}
                                 height={image.metadata?.height || undefined}
                                 style={{
                                    aspectRatio: image.metadata?.aspectRatio?.replace(':', '/') || '16/10',
                                 }}
                              />
                           </div>
                        </CarouselItem>
                     ))}
                  </CarouselContent>
               </Carousel>

               {/* Dot Indicators */}
               <div className='flex gap-2 justify-center my-2'>
                  {images.map((_, index) => (
                     <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={cn(
                           'w-2 h-2 rounded-full transition-all duration-200',
                           current === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                        )}
                        aria-label={`Go to image ${index + 1}`}
                     />
                  ))}
               </div>
            </div>
         )}
      </div>
   )
}

export default PostImage
