import env from '@/lib/env/client'

export default async function fetchHelper<T>(
	path: string,
	options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
	const url = `${env.NEXT_PUBLIC_API_URL}/v1${path}`
	const response = await fetch(url, options)
	const data = await response.json()

	if (response.status !== 200 && response.status !== 201)
		return { data: null, error: data.message, status: response.status }

	return { data: data as T, error: null, status: response.status }
}
