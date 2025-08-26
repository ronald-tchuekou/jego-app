import EmptyContent from '@/components/base/empty-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function MembersPage() {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Membres</CardTitle>
            <CardDescription>Gérez les membres de votre entreprise</CardDescription>
         </CardHeader>
         <CardContent>
            <EmptyContent
               text={'La fonctionnalité est en cours de développement'}
               actionContent={
                  <Button asChild>
                     <Link href='/'>Aller au dashboard</Link>
                  </Button>
               }
            />
         </CardContent>
      </Card>
   )
}
