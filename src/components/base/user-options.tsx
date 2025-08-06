"use client"

import { useAuth } from "../providers/auth";

export default function UserOptions() {
   const {auth} = useAuth();

   return (
		<div className='flex flex-col gap-2'>
			<pre>{JSON.stringify(auth, null, 2)}</pre>
		</div>
	)
}