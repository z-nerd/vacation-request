import { IRefreshResult } from "@/sdk/model/api";
import { fetcher } from "@/sdk/utility";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLocalStorage } from "react-use";


const refresh = (token: string) => {
  return useMutation({
    mutationKey: ['refresh', token],
    mutationFn: () => fetcher<IRefreshResult>('/api/login/refresh', {
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
  const { data, error, mutate } = refresh(String(refreshToken || ''))

  
  useEffect(() => {
    if (status === 401) {
      if (!error) mutate()
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