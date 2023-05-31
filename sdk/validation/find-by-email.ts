import Schema from "validate"
import isEmail from "validator/lib/isEmail"


export const FindByEmail = (value: any) => {
    const errors: any = {}

    const validator = new Schema({
        email: {
            required: true,
            type: String,
            use: { isEmail },
            message: {
                isEmail: (path: any) => `${path} must be a valid email.`
            }
        },
    })

    
    for (const err of validator.validate({ ...value }, { strict: false }))
        errors[err.path] = (err as any).message


    return Object.keys(errors).length > 0 ? errors : null
}