'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useLocalStorage } from "react-use"

export interface HomeProp {

}

export const Home = ({}: HomeProp) => {
    const router = useRouter()

    const [refreshToken] = useLocalStorage('refreshToken')
    const [accessToken] = useLocalStorage('accessToken')

    useEffect(() => {
      if(!refreshToken || !accessToken)
        router.push('/login')
    }, [])

    return (
        <>
        </>
    )
}