'use client'

import { Button } from '@/components/ui/button'
import { categoryKey } from '@/lib/query-kies'
import { useQueryClient } from '@tanstack/react-query'
import { LoaderIcon, Trash2Icon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { deleteCategoryAction } from '../actions'

type Props = {
   id: string
}

function DeleteCategoryButton({ id }: Props) {
   const queryClient = useQueryClient()

   const { execute, isPending } = useAction(deleteCategoryAction, {
      onSuccess: () => {
         toast.success('Catégorie supprimée avec succès.')
         queryClient.invalidateQueries({ queryKey: categoryKey.lists() }).then()
      },
      onError: (error) => {
         console.error('Error', error)
         toast.error(error.error.serverError || 'Une erreur est survenue', {
            duration: 8000,
         })
      },
   })

   return (
      <Button variant={'ghost'} size={'icon-sm'} disabled={isPending} onClick={() => execute(id)}>
         {isPending ? <LoaderIcon className={'animate-spin'} /> : <Trash2Icon className={'text-destructive'} />}
      </Button>
   )
}

export default DeleteCategoryButton
