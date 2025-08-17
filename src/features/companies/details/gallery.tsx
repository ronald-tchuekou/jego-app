import EmptyContent from '@/components/base/empty-content'
import ImageWithLoading from '@/components/base/image-with-loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { CompanyImageModel } from '@/services/company-image-service'

type Props = {
   images: CompanyImageModel[]
}

const CompanyGallery = ({ images }: Props) => {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Galerie de photos de l&apos;entreprise</CardTitle>
            <CardDescription>Liste des différentes photos que l&apos;entreprise a partagées.</CardDescription>
         </CardHeader>

         <CardContent>
            {images.length === 0 ? (
               <EmptyContent text='Aucune photo trouvée' />
            ) : (
               <Carousel>
                  <CarouselContent>
                     {images.map((image) => (
                        <CarouselItem key={image.id} className='md:basis-1/2 lg:basis-1/3'>
                           <div className='relative w-full h-full aspect-square border rounded-lg overflow-hidden'>
                              <ImageWithLoading
                                 src={image.path}
                                 alt={image.name}
                                 width={1000}
                                 height={1000}
                                 className='w-full h-auto aspect-square object-cover'
                              />
                           </div>
                        </CarouselItem>
                     ))}
                  </CarouselContent>
                  <CarouselPrevious variant={'default'} className='translate-x-10' />
                  <CarouselNext variant={'default'} className='-translate-x-10' />
               </Carousel>
            )}
         </CardContent>
      </Card>
   )
}

export default CompanyGallery
