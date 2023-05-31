import { ObjectId } from "mongodb"

type MethodType = boolean | { validator: string, error: Object }

export interface IRole{
    _id?: string | ObjectId
    role: string,
    subject: string,
    DELETE?: MethodType,
    GET?: MethodType,
    PATCH?: MethodType,
    POST?: MethodType
    PUT?: MethodType,
}