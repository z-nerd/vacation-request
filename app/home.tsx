'use client'

import { useRouter } from "next/navigation"
import { useLocalStorage } from "react-use"

export interface HomeProp {

}

export const Home = ({}: HomeProp) => {
    const router = useRouter()

    const [refreshToken] = useLocalStorage('refreshToken')
    const [accessToken] = useLocalStorage('accessToken')
  
    if(!refreshToken || !accessToken)
      router.push('/login')

    return (
        <>
        </>
    )
}