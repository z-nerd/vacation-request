import Schema from "validate"
import isEmail from "validator/lib/isEmail"
import isMobilePhoneValidator from "validator/lib/isMobilePhone"
import isStrongPasswordValidator from "validator/lib/isStrongPassword"
import isDateValidator from "validator/lib/isDate"

const isProfane = (string: string, wordList = ['ass', 'fuck']) => {
    return wordList.filter((word) => {
        return new RegExp(word).test(string.toLowerCase())
    }).length > 0 || false
}

export const RequestVacation = (value: any) => {
    const errors: any = {}

    const isUsernameInBlackList = (val: string) => !isProfane(val)
    const isMobilePhone = (val: string) => isMobilePhoneValidator(val, 'fa-IR')
    const isDate = (val: string) => isDateValidator(val)

    const validator = new Schema({
        fullname: {
            required: true,
            type: String
        },
        from: {
            required: true,
            type: String,
            use: {
                isDate
            },
            message: {
                isDate: (path: any) => `${path} It's not a valid date!`,
            }
        },
        to: {
            required: true,
            type: String,
            use: {
                isDate
            },
            message: {
                isDate: (path: any) => `${path} It's not a valid date!`,
            }
        },
        description: {
            required: true,
            type: String
        },
    })


    for (const err of validator.validate({ ...value }, { strict: false }))
        errors[err.path] = (err as any).message


    return Object.keys(errors).length > 0 ? errors : null
}