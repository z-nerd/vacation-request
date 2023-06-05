'use client'
import { ILoginResult } from "@/sdk/model/api"
import { FormEvent } from "react"


export interface LoginFormProp {
    OnResult: (data: ILoginResult) => void
    OnError: (error: any) => void
}


export const LoginForm = ({ OnResult, OnError }: LoginFormProp) => {
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = {
            username: event.currentTarget.username.value,
            password: event.currentTarget.password.value,
        }

        const response = await fetch('/api/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

        const resultData = await response.json()


        if (response.status === 200)
            OnResult(resultData)
        else
            OnError(resultData)
    }

    return (
        <form
            className="login-form"
            onSubmit={(handleSubmit)}>
            <label htmlFor="username"></label>
            <input type="text" id="username" placeholder="Enter username" required />

            <label htmlFor="password"></label>
            <input type="password" id="password" placeholder="Enter Password" required />

            <button type='submit'>LOGIN</button>
        </form>
    )
}