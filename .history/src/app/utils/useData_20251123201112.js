import { useMutation } from '@tanstack/react-query'

export const useGetData = () => {
	return useMutation({
		mutationFn: async (index) => {
			const url = index !== undefined && index !== null 
				? `/api/get-data?index=${index}`
				: '/api/get-data'
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			if (!response.ok) {
				throw new Error('failed to get data')
			}
			return response.json()
		},
	})
}
