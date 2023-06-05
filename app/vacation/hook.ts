import { fetcher } from "@/sdk/utility";
import { useQuery } from "@tanstack/react-query";


export const useGetVacation = (token: string) => {
    return useQuery({
        queryKey: ['getVacation'],
        queryFn: () => fetcher('/api/vacation', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token,
            },
        }),
        retry: 0,
    })
}