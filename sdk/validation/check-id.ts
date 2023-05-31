import { ObjectId } from "mongodb"
import Schema from "validate"

const isUUID = (val: string) => ObjectId.isValid(val)

export const IsMongoDbId = (value: any) => {
    const errors: any = {}

    const validator = new Schema({
        id: {
            required: true,
            type: String,
            use: { isUUID },
            message: {
                isUUID: (path: any) => `${path} isn't valid!`
            }
        }
    })

    
    for (const err of validator.validate({ ...value }, { strict: false }))
        errors[err.path] = (err as any).message


    return Object.keys(errors).length > 0 ? errors : null
}