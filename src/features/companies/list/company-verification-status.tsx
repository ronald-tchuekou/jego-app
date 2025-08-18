"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { companyKey } from '@/lib/query-kies'
import { CompanyModel } from '@/services/company-service'
import { useQueryClient } from '@tanstack/react-query'
import { BanIcon, CheckCircleIcon, ChevronDownIcon, LoaderIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { toggleApproveCompanyAction } from '../actions'

type Props = {
   company: CompanyModel
}

const CompanyVerificationStatus = ({ company }: Props) => {
   const queryClient = useQueryClient()

   const { execute, isPending } = useAction(toggleApproveCompanyAction, {
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: companyKey.all })
         toast.success(
            !company.verifiedAt ? 'Entreprise approuvée avec succès' : 'Entreprise non approuvée avec succès'
         )
      },
      onError: ({ error }) => {
         toast.error(error.serverError || 'Une erreur est survenue')
      },
   })

   const handleToggleApprove = () => {
      execute({ companyId: company.id })
   }

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className='flex items-center gap-1' disabled={isPending}>
            {isPending ? (
               <>
                  <LoaderIcon className='size-4 text-muted-foreground animate-spin' />
                  <span className='text-sm text-muted-foreground'>Chargement...</span>
               </>
            ) : company.verifiedAt ? (
               <>
                  <CheckCircleIcon className='h-4 w-4 text-green-500' />
                  <span className='text-sm text-green-600'>Approuvé</span>
               </>
            ) : (
               <>
                  <BanIcon className='h-4 w-4 text-orange-500' />
                  <span className='text-sm text-orange-600'>Non approuvé</span>
               </>
            )}
            <ChevronDownIcon className='size-4 text-muted-foreground' />
         </DropdownMenuTrigger>
         <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={handleToggleApprove}>
               <CheckCircleIcon className='text-green-500' />
               <span>Approuver l&apos;entreprise</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleApprove}>
               <BanIcon className='text-orange-500' />
               <span>Refuser l&apos;entreprise</span>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}

export default CompanyVerificationStatus
