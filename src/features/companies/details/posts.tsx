import EmptyContent from '@/components/base/empty-content'
import PostImage from '@/components/base/post-image'
import PostVideo from '@/components/base/post-video'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { formatDate } from '@/lib/utils'
import { PostModel } from '@/services/post-service'
import Link from 'next/link'

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
                        <PostItem post={post} key={post.id} />
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

const PostItem = ({ post }: { post: PostModel }) => {
   const mediaType = post.mediaType
   const medias = post.medias || []

   return (
      <CarouselItem key={post.id} className='md:basis-1/2 lg:basis-1/3'>
         <Card>
            <CardContent>
               <Link href={`/posts/${post.id}`} className='space-y-4 block group'>
                  {medias.length > 0 && (
                     <CardContent className='pt-0'>
                        {/* For images */}
                        {mediaType === 'image' && <PostImage images={medias} />}

                        {/* For videos */}
                        {mediaType === 'video' && <PostVideo videoPaths={medias} />}
                     </CardContent>
                  )}
                  <div className='flex flex-col gap-2'>
                     <h3 className='text-lg font-semibold line-clamp-1 group-hover:text-primary'>{post.title}</h3>
                     <p className='text-sm text-muted-foreground line-clamp-2'>{post.description}</p>
                     <p className='text-xs text-muted-foreground'>{formatDate(post.createdAt)}</p>
                     <div className='flex flex-wrap gap-2'>
                        <Badge variant={'outline'}>{post.category}</Badge>
                        <Badge variant={'outline'}>{post.type}</Badge>
                     </div>
                  </div>
               </Link>
            </CardContent>
         </Card>
      </CarouselItem>
   )
}

export default CompanyPost
