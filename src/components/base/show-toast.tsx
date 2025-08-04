"use client"

import { toast } from "sonner"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export const ShowToast = () => {
   return (
		<Card>
			<CardHeader>
				<CardTitle>Show Toast Example</CardTitle>
				<CardDescription>Click any button below to display a toast notification.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-2">
					<Label>Title</Label>
					<Input placeholder="Enter title" />
					<Label>Description</Label>
					<Input placeholder="Enter description" />
				</div>
			</CardContent>
			<CardFooter className="flex items-center gap-3">
				<Button onClick={() => toast.success('Hello you clicked the button')} size="lg" variant="default">
					Show toast
				</Button>
				<Button onClick={() => toast.success('Hello you clicked the button')} size="default" variant="secondary">
					Show toast
				</Button>
				<Button onClick={() => toast.success('Hello you clicked the button')} size="sm" variant="ghost">
					Show toast
				</Button>
			</CardFooter>
		</Card>
	)
}