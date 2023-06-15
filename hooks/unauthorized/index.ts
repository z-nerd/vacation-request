import { IRefreshResult } from "@/sdk/model/api";
import { fetcher } from "@/sdk/utility";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useBrowserStorage } from "../browser-storage";


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


export const useRefreshLogin = () => {
  const { data, mutate } = refreshApi()
  const { refreshToken, setAccessToken, setUserInfo } = useBrowserStorage()

  useEffect(() => {
    if (refreshToken) {
      mutate(refreshToken)
    }

  }, [refreshToken])

  useEffect(() => {
    if (data) {
      setAccessToken(data.accessToken)
      setUserInfo(data.userInfo)
    }
  }, [data])
}


export const useNeedLogin = (redirectLogin: boolean) => {
  const router = useRouter()
  const { refreshToken, accessToken } = useBrowserStorage()
  const [isUserLogin, setIsUserLogin] = useState(false)

  useEffect(() => {
    if (!refreshToken && !accessToken) {
      setIsUserLogin(state => false)
      if (redirectLogin) router.push('/login')
    } else {
      setIsUserLogin(state => true)
    }

  }, [isUserLogin, refreshToken, accessToken])

  return { isUserLogin }
}