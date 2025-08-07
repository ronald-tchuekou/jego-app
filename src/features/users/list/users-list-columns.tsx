"use client"

import { useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { Ban, CheckCircle, Eye, MoreVertical, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserModel, UserRole } from '@/services/user-service'
import { deleteUserAction, toggleBlockUserAction } from "../actions"

// Actions component for the dropdown menu
function UserActions({ user }: { user: UserModel }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  const isBlocked = user.blockedAt !== null

  const handleDelete = async () => {
		setIsLoading(true)
		try {
			const result = await deleteUserAction({ userId: user.id })
			if (result?.serverError) {
				toast.error(result.serverError)
			} else if (result?.data?.success) {
				toast.success(result.data.message)
				setDeleteDialogOpen(false)
				// Invalidate and refetch users data
				queryClient.invalidateQueries({ queryKey: ['users'] })
			}
		} catch (error) {
			console.error(error)
			toast.error('Erreur lors de la suppression')
		} finally {
			setIsLoading(false)
		}
  }

  const handleToggleBlock = async () => {
		setIsLoading(true)
		try {
			const result = await toggleBlockUserAction({ userId: user.id })
			if (result?.serverError) {
				toast.error(result.serverError)
			} else if (result?.data?.success) {
				toast.success(result.data.message)
				setBlockDialogOpen(false)
				// Invalidate and refetch users data
				queryClient.invalidateQueries({ queryKey: ['users'] })
			}
		} catch (error) {
			console.error(error)
			toast.error('Erreur lors de la modification du statut')
		} finally {
			setIsLoading(false)
		}
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={isLoading}
          >
            <span className="sr-only">Ouvrir le menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => router.push(`/users/${user.id}`)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            Voir les détails
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setBlockDialogOpen(true)}
            className="cursor-pointer"
          >
            {isBlocked ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Débloquer le compte
              </>
            ) : (
              <>
                <Ban className="mr-2 h-4 w-4" />
                Bloquer le compte
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer le compte
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le compte de{" "}
              <strong>{user.displayName}</strong> ? Cette action est
              irréversible et toutes les données associées seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block/Unblock confirmation dialog */}
      <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isBlocked ? "Débloquer le compte" : "Bloquer le compte"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBlocked
                ? `Êtes-vous sûr de vouloir débloquer le compte de ${user.displayName} ? L'utilisateur pourra à nouveau accéder à son compte.`
                : `Êtes-vous sûr de vouloir bloquer le compte de ${user.displayName} ? L'utilisateur ne pourra plus accéder à son compte.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleBlock}
              disabled={isLoading}
            >
              {isLoading
                ? "Modification..."
                : isBlocked
                ? "Débloquer"
                : "Bloquer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Helper function to get role badge variant
function getRoleBadgeVariant(role: UserRole) {
  switch (role) {
    case UserRole.ADMIN:
      return "destructive"
    case UserRole.COMPANY_ADMIN:
      return "default"
    case UserRole.COMPANY_AGENT:
      return "secondary"
    default:
      return "outline"
  }
}

// Helper function to get role label in French
function getRoleLabel(role: UserRole) {
  switch (role) {
    case UserRole.ADMIN:
      return "Administrateur"
    case UserRole.COMPANY_ADMIN:
      return "Admin Entreprise"
    case UserRole.COMPANY_AGENT:
      return "Agent Entreprise"
    case UserRole.USER:
      return "Utilisateur"
    default:
      return role
  }
}

// Helper function to format date
function formatDate(date: string | null) {
	if (!date) return 'Jamais'
	return Intl.DateTimeFormat('fr-FR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(new Date(date))
}

export const usersListColumns: ColumnDef<UserModel>[] = [
	{
		accessorKey: 'displayName',
		header: 'Utilisateur',
		cell: ({ row }) => {
			const user = row.original
			const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`

			return (
				<div className='flex items-center space-x-3'>
					<Avatar className='h-8 w-8'>
						<AvatarImage src={user.profileImage || undefined} alt={user.displayName} />
						<AvatarFallback className='text-xs'>{initials}</AvatarFallback>
					</Avatar>
					<div className='flex flex-col'>
						<span className='font-medium'>{user.displayName}</span>
						<span className='text-sm text-muted-foreground'>{user.email}</span>
					</div>
				</div>
			)
		},
	},
	{
		accessorKey: 'role',
		header: 'Rôle',
		cell: ({ row }) => {
			const role = row.getValue('role') as UserRole
			return <Badge variant={getRoleBadgeVariant(role)}>{getRoleLabel(role)}</Badge>
		},
	},
	{
		accessorKey: 'company',
		header: 'Entreprise',
		cell: ({ row }) => {
			const company = row.original.company
			return <span className='text-sm'>{company ? company.name : 'Aucune'}</span>
		},
	},
	{
		accessorKey: 'verifiedAt',
		header: 'Vérification',
		cell: ({ row }) => {
			return (
				<div className='flex items-center space-x-2'>
					{row.original.verifiedAt ? (
						<>
							<CheckCircle className='h-4 w-4 text-green-500' />
							<span className='text-sm text-green-600'>Vérifié</span>
						</>
					) : (
						<>
							<Ban className='h-4 w-4 text-orange-500' />
							<span className='text-sm text-orange-600'>Non vérifié</span>
						</>
					)}
				</div>
			)
		},
	},
	{
		accessorKey: 'blockedAt',
		header: 'Statut',
		cell: ({ row }) => {
			return (
				<Badge variant={row.original.blockedAt ? 'destructive' : 'default'}>
					{row.original.blockedAt ? 'Bloqué' : 'Actif'}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'lastLoginAt',
		header: 'Dernière connexion',
		cell: ({ row }) => {
			return <span className='text-sm text-muted-foreground'>{formatDate(row.original.lastLoginAt)}</span>
		},
	},
	{
		accessorKey: 'createdAt',
		header: 'Inscription',
		cell: ({ row }) => {
			return <span className='text-sm text-muted-foreground'>{formatDate(row.original.createdAt)}</span>
		},
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => <UserActions user={row.original} />,
	},
]
