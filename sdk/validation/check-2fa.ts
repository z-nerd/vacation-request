import { ObjectId } from "mongodb"
import Schema from "validate"

const isUUID = (val: string) => ObjectId.isValid(val) // new ObjectId().toString()
const isCode = (val: string) => /^[0-9]+$/.test(val)

export const Check2fa = (value: any) => {
    const errors: any = {}

    const validator = new Schema({
        id: {
            required: true,
            type: String,
            use: { isUUID },
            message: {
                isUUID: (path: any) => `${path} must be a valid!`
            }
        },
        code: {
            required: true,
            type: String,
            length: 5,
            use: { isCode },
            message: {
                length: (path: any) => `${path} must have a length of 5!`,
                isCode: (path: any) => `${path} must be a valid!`,
            }
        }
    })

    
    for (const err of validator.validate({ ...value }, { strict: false }))
        errors[err.path] = (err as any).message


    return Object.keys(errors).length > 0 ? errors : null
}