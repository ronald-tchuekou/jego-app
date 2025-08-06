'use client'
import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useLogoutModalStore } from '@/lib/stores/logout-modal-store'
import { LoaderIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { logoutAction } from './actions'

export default function LogoutModal() {
	const { isVisible, closeModal } = useLogoutModalStore()

	const { isPending, execute } = useAction(logoutAction, {
		onSuccess() {
			closeModal()
		},
		onError(err) {
			toast.error('Oops !', { description: err.error.serverError || 'Une erreur est survenue.', duration: 6000 })
			closeModal()
		},
	})

	return (
		<AlertDialog open={isVisible}>
			<AlertDialogContent className='sm:max-w-[425px]'>
				<AlertDialogHeader>
					<AlertDialogTitle>Attention</AlertDialogTitle>
					<AlertDialogDescription>{null}</AlertDialogDescription>
				</AlertDialogHeader>
				<p className='text-base text-muted-foreground text-center mb-4'>
					Voulez-vous vraiment vous déconnecter ?
				</p>
				<AlertDialogFooter className='gap-3'>
					<Button onClick={closeModal} disabled={isPending} variant={'secondary'} size={'sm'}>
						NON
					</Button>
					<Button
						disabled={isPending}
						onClick={() => execute()}
						size={'sm'}
					>
						{isPending && <LoaderIcon className={'animate-spin'} />}
						OUI
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
