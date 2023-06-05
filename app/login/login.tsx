'use client'

import { useState } from "react"
import { LoginForm } from "./login-form"
import { VerifyForm } from "./verify-form"
import { useLocalStorage } from "react-use"
import { useRouter } from 'next/navigation'
import { ILoginResult } from "@/sdk/model/api"


export interface LoginProp {
}


export const Login = ({ }: LoginProp) => {
    const router = useRouter()
    const [loginResult, setLoginResult] = useState<ILoginResult | null>(null)
    const [loginError, setLoginError] = useState<any | null>(null)

    const [accessToken, setAccessToken] = useLocalStorage('accessToken')
    const [refreshToken, setRefreshToken] = useLocalStorage('refreshToken')

    return (
        <>
            {
                !loginResult
                    ?
                    <LoginForm
                        OnResult={(data) => {
                            setLoginResult(data)
                        }}
                        OnError={(error) => {
                            setLoginError(error)
                        }}
                    />
                    :
                    <VerifyForm
                        id={loginResult.id}
                        OnResult={(data) => {
                            setAccessToken(data.accessToken)
                            setRefreshToken(data.refreshToken)

                            router.push('/')
                        }}
                        OnError={(error) => {
                            console.log('error', error)
                        }}
                    />
            }
        </>
    )
}