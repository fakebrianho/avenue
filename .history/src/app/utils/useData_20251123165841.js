import { useMutation } from '@tanstack/react-query'

export const useGetData = () => {
	return useMutation({
		mutationFn: async (data) => {
			const response = await fetch('/api/get-data', {
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
