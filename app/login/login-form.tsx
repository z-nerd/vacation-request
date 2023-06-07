'use client'
import { ILoginResult } from "@/sdk/model/api"
import { Login } from "@/sdk/validation/login"
import { FormEvent } from "react"



// ***********************************

// import Schema from "validate"
// import isEmail from "validator/lib/isEmail"
// import isMobilePhoneValidator from "validator/lib/isMobilePhone"
// import isStrongPasswordValidator from "validator/lib/isStrongPassword"

// const isProfane = (string: string, wordList = ['ass', 'fuck']) => {
//     return wordList.filter((word) => {
//         return new RegExp(word).test(string.toLowerCase())
//     }).length > 0 || false
// }

// const isUsername = (val: string) => /^[A-Za-z](?:[a-zA-Z0-9]|([_])(?!\1)){2,30}[A-Za-z\d]$/.test(val)
// const isUsernameInBlackList = (val: string) => !isProfane(val)
// const isMobilePhone = (val: string) => isMobilePhoneValidator(val, 'fa-IR')

// const isLoginUsername = (val: string) => isEmail(val) || isMobilePhone(val) || 
// (isUsernameInBlackList(val) && isUsername(val))

// export const Login = (value: any) => {
//     const errors: any = {}


//     const validator = new Schema({
//         username: {
//             required: true,
//             type: String,
//             use: {
//                 isLoginUsername
//             },
//             message: {
//                 isLoginUsername: (path: any) => `${path} It's not valid!`,
//             }
//         },
//         password: {
//             required: true,
//             type: String,
//             use: {
//                 isStrongPasswordValidator
//             },
//             message: {
//                 isStrongPasswordValidator: (path: any) => `${path} It's not a valid`,
//             }
//         },
//     })


//     for (const err of validator.validate({ ...value }, { strict: true }))
//         errors[err.path] = (err as any).message


//     return Object.keys(errors).length > 0 ? errors : null
// }

// ***********************************

export interface LoginFormProp {
    OnResult: (data: ILoginResult) => void
    OnError: (error: any) => void
}


export const LoginForm = ({ OnResult, OnError }: LoginFormProp) => {
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const txtFormErrorRef = document.querySelector('form > span.error-form') as HTMLSpanElement
        const txtUsernameRef: HTMLInputElement = event.currentTarget.username
        const txtUsernameErrorRef = document.querySelector('#username + span.error') as HTMLInputElement
        const txtPasswordRef: HTMLInputElement = event.currentTarget.password
        const txtPasswordErrorRef = document.querySelector('#password + span.error') as HTMLInputElement
        const btnLoginRef: HTMLInputElement = event.currentTarget.login

        txtUsernameErrorRef.textContent = ""
        txtPasswordErrorRef.textContent = ""
        btnLoginRef.disabled = true

        const data = {
            username: txtUsernameRef.value,
            password: txtPasswordRef.value,
        }

        interface IVError {
            username?: string 
            password?: string
        }

        const error: IVError | null = Login(data)

        if (!error) {
            const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
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
            if(error?.username) txtUsernameErrorRef.textContent = error.username
            if(error?.password) txtPasswordErrorRef.textContent = error.password
        }


        btnLoginRef.disabled = false
    }

    return (
        <form
            method="POST"
            className="login-form"
            onSubmit={(handleSubmit)}
            noValidate>
            <span className="error-form" aria-live="polite"></span>

            <label htmlFor="username">
                <span>username:</span>
                <input type="text" id="username" name="username" placeholder="Enter username" required />
                <span className="error" aria-live="polite"></span>
            </label>

            <label htmlFor="password">
                <span>password:</span>
                <input type="password" id="password" name="password" placeholder="Enter password" required />
                <span className="error" aria-live="polite"></span>
            </label>

            <button type="submit" name="login">LOGIN</button>
        </form>
    )
}