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

export const Register = (value: any) => {
    const errors: any = {}

    const isUsername = (val: string) => /^[A-Za-z](?:[a-zA-Z0-9]|([_])(?!\1)){2,30}[A-Za-z\d]$/.test(val)
    const isUsernameInBlackList = (val: string) => !isProfane(val)
    const isMobilePhone = (val: string) => isMobilePhoneValidator(val, 'fa-IR')
    const isDate = (val: string) => isDateValidator(val)
    const isStrongPassword = (val: string) => isStrongPasswordValidator(val, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
    })


    const validator = new Schema({
        fullname: {
            required: true,
            type: String,
        },
        birthday: {
            required: true,
            type: String,
            use: {
                isDate
            },
            message: {
                isDate: (path: any) => `${path} It's not a valid date!`,
            }
        },
        phone: {
            required: true,
            type: String,
            use: {
                isMobilePhone
            },
            message: {
                isMobilePhone: (path: any) => `${path} It's not a valid number!`,
            }
        },
        password: {
            required: true,
            type: String,
            use: {
                isStrongPasswordValidator
            },
            message: {
                isStrongPasswordValidator: (path: any) => `${path} It's not a valid password!`,
            }
        },
        username: {
            required: true,
            type: String,
            use: {
                // isUsername,
                isUsernameInBlackList
            },
            // length: { min: 4, max: 8 },
            message: {
                // length: (path, ctx, args) => {
                //     const feild = (ctx as any)[path]

                //     if(feild.length < args.min)
                //         return `It's too short! ${feild.length}`
                //     else
                //         return `It's too much! ${feild.length}`
                // },
                // isUsername: (path: any) => `${path} must be a valid!!`,
                isUsernameInBlackList: (path: any) => `${path} It's not allows!!`,
            }
        },
        email: {
            required: true,
            type: String,
            use: { isEmail },
            message: {
                isEmail: (path: any) => `${path} must be a valid email.`
            }
        },
    })


    for (const err of validator.validate({ ...value }, { strict: true }))
        errors[err.path] = (err as any).message


    return Object.keys(errors).length > 0 ? errors : null
}