"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"
import { DEFAULT_AVATAR } from "@/lib/constants"
import env from "@/lib/env/client"
import { cn, formatDate, getRoleLabel } from "@/lib/utils"
import { UserModel } from "@/services/user-service"
import { BanIcon, CheckCircleIcon, CircleIcon } from "lucide-react"
import UserActions from "./user-item-actions"

type Props = {
   user: UserModel
}

const UserItem = ({ user }: Props) => {
   const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
	const userProfile = user?.profileImage ? `${env.NEXT_PUBLIC_API_URL}/v1/${user?.profileImage}` : DEFAULT_AVATAR

   return (
		<TableRow>
			<TableCell>
				<div className='flex items-center space-x-3'>
					<Avatar className='size-10'>
						<AvatarImage src={userProfile} alt={user.displayName} />
						<AvatarFallback className='text-xs'>{initials}</AvatarFallback>
					</Avatar>
					<div className='flex flex-col'>
						<span className='font-medium'>{user.displayName}</span>
						<span className='text-sm text-muted-foreground'>{user.email}</span>
					</div>
				</div>
			</TableCell>
			<TableCell>
				<Badge variant={'outline'}>{getRoleLabel(user.role)}</Badge>
			</TableCell>
			<TableCell>{user.company?.name || '- - -'}</TableCell>
			<TableCell>
				<div className='flex items-center gap-1'>
					{user.verifiedAt ? (
						<>
							<CheckCircleIcon className='h-4 w-4 text-green-500' />
							<span className='text-sm text-green-600'>Vérifié</span>
						</>
					) : (
						<>
							<BanIcon className='h-4 w-4 text-orange-500' />
							<span className='text-sm text-orange-600'>Non vérifié</span>
						</>
					)}
				</div>
			</TableCell>
			<TableCell>
				<div className='flex items-center gap-1'>
					<CircleIcon
						className={cn('size-2 fill-destructive stroke-0 text-destructive', {
							'fill-green-500 stroke-0 text-green-500': !user.blockedAt,
						})}
					/>
					<span
						className={cn('text-sm text-destructive', {
							'text-green-600': !user.blockedAt,
						})}
					>
						{user.blockedAt ? 'Bloqué' : 'Actif'}
					</span>
				</div>
			</TableCell>
			<TableCell>{formatDate(user.lastLoginAt)}</TableCell>
			<TableCell>{formatDate(user.createdAt)}</TableCell>
			<TableCell>
				<UserActions user={user} />
			</TableCell>
		</TableRow>
	)
}

export default UserItem;
