import Schema from "validate"
import isEmail from "validator/lib/isEmail"
import isMobilePhoneValidator from "validator/lib/isMobilePhone"
import isStrongPasswordValidator from "validator/lib/isStrongPassword"

const isProfane = (string: string, wordList = ['ass', 'fuck']) => {
    return wordList.filter((word) => {
        return new RegExp(word).test(string.toLowerCase())
    }).length > 0 || false
}

const isUsername = (val: string) => /^[A-Za-z](?:[a-zA-Z0-9]|([_])(?!\1)){2,30}[A-Za-z\d]$/.test(val)
const isUsernameInBlackList = (val: string) => !isProfane(val)
const isMobilePhone = (val: string) => isMobilePhoneValidator(val, 'fa-IR')

const isLoginUsername = (val: string) => isEmail(val) || isMobilePhone(val) || 
(isUsernameInBlackList(val) && isUsername(val))

export const Login = (value: any) => {
    const errors: any = {}


    const validator = new Schema({
        username: {
            required: true,
            type: String,
            use: {
                isLoginUsername
            },
            message: {
                isLoginUsername: (path: any) => `${path} It's not valid!`,
            }
        },
        password: {
            required: true,
            type: String,
            use: {
                isStrongPasswordValidator
            },
            message: {
                isStrongPasswordValidator: (path: any) => `${path} It's not a valid`,
            }
        },
    })


    for (const err of validator.validate({ ...value }, { strict: true }))
        errors[err.path] = (err as any).message


    return Object.keys(errors).length > 0 ? errors : null
}