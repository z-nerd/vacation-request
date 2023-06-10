import { IRefreshResult } from "@/sdk/model/api";
import { fetcher } from "@/sdk/utility";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLocalStorage } from "react-use";


export const refreshApi = () => {
  return useMutation({
    mutationKey: ['refresh'],
    mutationFn: (token: string) => fetcher<IRefreshResult>('/api/login/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'r-token': token,
      },
    }),
    retry: 0,
  })
}


export const userRedirectLogin = (status: number | undefined) => {
  const router = useRouter()
  const [refreshToken] = useLocalStorage('refreshToken')
  const [accessToken, setAccessToken] = useLocalStorage('accessToken')
  const { data, error, mutate } = refreshApi()

  
  useEffect(() => {
    if (status === 401) {
      if (!error) mutate(String(refreshToken || ''))
      if (error) router.push('/login')
    }
  }, [status, error])


  useEffect(() => {
    if (status === 401)
      if (data) {
        setAccessToken(data.accessToken)
        window.location.reload()
      }
  }, [status, data])
}


export const useRefreshLogin = () => {
  const {data, mutate} = refreshApi()
  const [refreshToken] = useLocalStorage<string>('refreshToken')
  const [,setAccessToken] = useLocalStorage<string>('accessToken')
  
  useEffect(() => {
      if(refreshToken) {
          mutate(refreshToken)
      }

  }, [refreshToken]) 

  useEffect(() => (data) && setAccessToken(data.accessToken), [data])
}