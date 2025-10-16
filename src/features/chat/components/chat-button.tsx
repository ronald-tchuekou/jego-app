'use client'

import { useAuth } from '@/components/providers/auth'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import useStartConversation from '@/features/chat/hooks/use-start-conversation'
import { UserModel, UserRole } from '@/services/user-service'
import { MessageCircleMoreIcon } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
	companyUsers: UserModel[]
	className?: string
}

const ChatButton = ({ companyUsers, className }: Props) => {
	const { auth } = useAuth()
	const { startConversation, isStarting, error } = useStartConversation()

	// Find the company admin - prioritize COMPANY_ADMIN, fallback to COMPANY_AGENT
	const companyAdmin =
		companyUsers.find((user) => user.role === UserRole.COMPANY_ADMIN && user.companyId) ||
		companyUsers.find((user) => user.role === UserRole.COMPANY_AGENT && user.companyId)

	// Don't show button if:
	// - User is not authenticated
	// - No admin/agent found in company users
    // - User is trying to chat with themselves
	if (!auth?.user || !companyUsers?.length || !companyAdmin || companyAdmin.id === auth.user.id) {
		return null
	}

	const handleStartChat = () => {
		try {
			startConversation({ participantId: companyAdmin.id })
		} catch (error) {
			console.error('Error starting chat:', error)
			toast.error('Impossible de démarrer la conversation')
		}
	}

	// Show error if there was an issue starting the conversation
	if (error) {
		toast.error("Erreur lors de l'ouverture de la conversation")
	}

	return (
		<Button onClick={handleStartChat} disabled={isStarting || !companyAdmin} variant='outline' className={className}>
			{isStarting ? <Spinner /> : <MessageCircleMoreIcon />}
			<span className='hidden md:block'>{isStarting ? 'Ouverture...' : 'Contacter'}</span>
		</Button>
	)
}

export default ChatButton
