import Schema from "validate"
import isMobilePhoneValidator from "validator/lib/isMobilePhone"


const isMobilePhone = (val: string) => isMobilePhoneValidator(val, 'fa-IR')


export const FindByPhone = (value: any) => {
    const errors: any = {}

    const validator = new Schema({
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
    })

    
    for (const err of validator.validate({ ...value }, { strict: false }))
        errors[err.path] = (err as any).message


    return Object.keys(errors).length > 0 ? errors : null
}