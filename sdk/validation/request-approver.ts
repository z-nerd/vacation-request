import { ObjectId } from "mongodb"
import Schema from "validate"

const isUUID = (val: string) => ObjectId.isValid(val) // new ObjectId().toString()
const isStatus = (val: string) => ['rejected', 'accepted', 'waiting'].includes(val)

export const RequestApprover = (value: any) => {
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
        status: {
            required: true,
            type: String,
            use: { isStatus },
            message: {
                isStatus: (path: any) => `${path} must be a valid!`,
            }
        }
    })

    
    for (const err of validator.validate({ ...value }, { strict: false }))
        errors[err.path] = (err as any).message


    return Object.keys(errors).length > 0 ? errors : null
}