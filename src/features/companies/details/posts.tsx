import EmptyContent from '@/components/base/empty-content'
import ImageWithLoading from '@/components/base/image-with-loading'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { formatDate } from '@/lib/utils'
import { PostModel } from '@/services/post-service'

type Props = {
   posts: PostModel[]
}

const CompanyPost = ({ posts }: Props) => {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Publications de l&apos;entreprise</CardTitle>
            <CardDescription>Liste des différentes publications que l&apos;entreprise a partagées.</CardDescription>
         </CardHeader>

         <CardContent>
            {posts.length === 0 ? (
               <EmptyContent text='Aucune publication trouvée' />
            ) : (
               <Carousel>
                  <CarouselContent>
                     {posts.map((post) => (
                        <CarouselItem key={post.id} className='md:basis-1/2 lg:basis-1/3'>
                           <Card>
                              <CardContent className='space-y-4'>
                                 {post.image && (
                                    <div className='relative w-full h-full aspect-video border rounded-lg overflow-hidden'>
                                       <ImageWithLoading
                                          src={post.image}
                                          alt={post.title}
                                          width={1000}
                                          height={1000}
                                          className='w-full h-auto aspect-video object-cover'
                                       />
                                    </div>
                                 )}
                                 <div className='flex flex-col gap-2'>
                                    <h3 className='text-lg font-semibold line-clamp-1'>{post.title}</h3>
                                    <p className='text-sm text-muted-foreground line-clamp-2'>{post.description}</p>
                                    <p className='text-xs text-muted-foreground'>{formatDate(post.createdAt)}</p>
                                    <div className='flex flex-wrap gap-2'>
                                       <Badge variant={'outline'}>{post.category}</Badge>
                                       <Badge variant={'outline'}>{post.type}</Badge>
                                    </div>
                                 </div>
                              </CardContent>
                           </Card>
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

export default CompanyPost
