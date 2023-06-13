import { useLocalStorage, useSessionStorage } from "react-use"


export const useBrowserStorage = () => {
    const [refreshToken, setRefreshToken] = useLocalStorage<string | undefined>('token')
    const [accessToken, setAccessToken] = useSessionStorage<string | undefined>('token')


    return { refreshToken, setRefreshToken, accessToken, setAccessToken }
} 