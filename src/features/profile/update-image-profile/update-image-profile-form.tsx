'use client'

import { useAuth } from '@/components/providers/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DEFAULT_AVATAR } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon, Upload } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { updateImageProfileAction } from '../actions'
import { defaultUpdateImageProfileValue, updateImageProfileSchema, type UpdateImageProfileSchema } from './schema'

export default function UpdateImageProfileForm() {
	const { auth } = useAuth()
	const user = auth?.user

	const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profileImage || DEFAULT_AVATAR)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const form = useForm<UpdateImageProfileSchema>({
		resolver: zodResolver(updateImageProfileSchema),
		defaultValues: defaultUpdateImageProfileValue,
	})

	const { execute, isPending } = useAction(updateImageProfileAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				toast.success(data.message)
			}
		},
		onError: ({ error }) => {
			toast.error(error.serverError || 'Une erreur est survenue', { duration: 8000 })
		},
	})

	const onSubmit = (data: UpdateImageProfileSchema) => {
		const formData = new FormData()
		formData.append('image', data.image)
		execute({ image: data.image })
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			form.setValue('image', file)

			// Create preview URL
			const reader = new FileReader()
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	const handleUploadClick = () => {
		fileInputRef.current?.click()
	}

	const initials = user?.firstName
		? user?.firstName
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
				.slice(0, 2)
		: 'U'

	return (
		<Card>
			<CardHeader>
				<CardTitle>Photo de profil</CardTitle>
				<CardDescription>Mettez à jour votre photo de profil</CardDescription>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						<div className='flex flex-col space-y-4'>
							<Avatar className='size-32 border-2 border-primary'>
								<AvatarImage src={previewUrl || DEFAULT_AVATAR} alt={user?.displayName} />
								<AvatarFallback className='text-2xl'>{initials}</AvatarFallback>
							</Avatar>

							<FormField
								control={form.control}
								name='image'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormControl>
											<div>
												<Input
													{...field}
													ref={fileInputRef}
													type='file'
													accept='image/jpeg,image/png,image/webp'
													className='hidden'
													onChange={handleFileChange}
												/>
												<Button type='button' variant='outline' onClick={handleUploadClick}>
													<Upload className='w-4 h-4 mr-2' />
													Choisir une image
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className='text-sm text-muted-foreground'>
							<p>Formats acceptés: JPEG, PNG, WebP</p>
							<p>Taille maximale: 5MB</p>
						</div>

						<Button type='submit' disabled={isPending || !form.watch('image')}>
							{isPending && <LoaderIcon className='animate-spin' />}
							<span>Mettre à jour la photo</span>
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
