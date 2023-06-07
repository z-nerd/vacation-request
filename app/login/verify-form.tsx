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
        const txtFormErrorRef = document.querySelector('form > span.error-form') as HTMLSpanElement
        const txtCode: HTMLInputElement = event.currentTarget.code
        const txtCodeErrorRef = document.querySelector('#code + span.error') as HTMLInputElement
        const btnVerifyRef: HTMLInputElement = event.currentTarget.verify

        txtCodeErrorRef.textContent = ""
        btnVerifyRef.disabled = true

        const error: {code?: string} | null = ((code: string) => {
            if(code.length !== 5) 
                return {code: 'code must have a length of 5!'}
            
            if(!/^[0-9]+$/.test(code)) 
                return {code: 'code must be a valid!'}

            return null
        })(txtCode.value)

        if (!error) {
            const response = await fetch('/api/login/2fa',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        id,
                        code: txtCode.value,
                    }
                })

            const resultData = await response.json()

            if (response.status === 200) {
                OnResult(resultData)
                txtFormErrorRef.textContent = ""
            }
            else {
                OnError(resultData)
                txtFormErrorRef.textContent = resultData.error.message
            }
        } else {
            if(error?.code) txtCodeErrorRef.textContent = error.code
        }


        btnVerifyRef.disabled = false
    }

    return (
        <form
            className="verify-form"
            autoComplete="off"
            onSubmit={(handleSubmit)}>
            <span className="error-form" aria-live="polite"></span>

            <label htmlFor="code">
                <span>code:</span>
                <input type="tel" id="code" name="code" placeholder="Enter code" required />
                <span className="error" aria-live="polite"></span>
            </label>

            <button type="submit" name="verify">Verify</button>
        </form>
    )
}