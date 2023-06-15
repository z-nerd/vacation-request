import { IUserInfo } from "@/sdk/model/api"
import { useLocalStorage, useSessionStorage } from "react-use"


export const useBrowserStorage = () => {
    const [refreshToken, setRefreshToken] = useLocalStorage<string | undefined>('token')
    const [accessToken, setAccessToken] = useSessionStorage<string | undefined>('token')
    const [userInfo, setUserInfo] = useSessionStorage<IUserInfo | undefined>('userInfo')

    return { refreshToken, setRefreshToken, accessToken, setAccessToken, userInfo, setUserInfo }
} 