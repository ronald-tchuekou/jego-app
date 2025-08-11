import env from '@/lib/env/client'

export default async function fetchHelper<T>(path: string, options: RequestInit = {}) {
	const url = `${env.NEXT_PUBLIC_API_URL}/v1${path}`
	const response = await fetch(url, options)
	const data = await response.json()

	if (response.status !== 200 && response.status !== 201) {
		console.error(data)
		throw new Error(data.message)
	}

	return data as T
}
