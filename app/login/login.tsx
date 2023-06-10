'use client'

import { useState } from "react"
import { LoginForm } from "./login-form"
import { VerifyForm } from "./verify-form"
import { useRouter } from 'next/navigation'
import { ILoginResult } from "@/sdk/model/api"
import { useBrowserStorage } from "@/hooks"


export interface LoginProp {
}


export const Login = ({ }: LoginProp) => {
    const router = useRouter()
    const [loginResult, setLoginResult] = useState<ILoginResult | null>(null)
    const [loginError, setLoginError] = useState<any | null>(null)
    const { setRefreshToken, setAccessToken } = useBrowserStorage()


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