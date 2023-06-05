'use client'
import { IVerifyResult } from "@/sdk/model/api"
import { FormEvent } from "react"


export interface VerifyFormProp {
    id: string
    OnResult: (data: IVerifyResult) => void
    OnError: (error: any) => void
}


export const VerifyForm = ({ id, OnResult, OnError }: VerifyFormProp) => {
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const response = await fetch('/api/login/2fa',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    id,
                    code: event.currentTarget.code.value,
                }
            })

        const resultData = await response.json()

        if (response.status === 200)
            OnResult(resultData)
        else
            OnError(resultData)
    }

    return (
        <form
            className="verify-form"
            autoComplete="off"
            onSubmit={(handleSubmit)}>
            <label htmlFor="code"></label>
            <input type="tel" id="code" placeholder="Enter code" required />

            <button type='submit'>Verify</button>
        </form>
    )
}