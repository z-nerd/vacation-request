import { useLocalStorage, useSessionStorage } from "react-use"


export const useBrowserStorage = () => {
    const [refreshToken, setRefreshToken] = useLocalStorage<string | undefined>('token', undefined)
    const [accessToken, setAccessToken] = useSessionStorage<string | undefined>('token', undefined)


    return { refreshToken, setRefreshToken, accessToken, setAccessToken }
} 