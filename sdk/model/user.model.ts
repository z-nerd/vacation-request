import { ObjectId } from "mongodb"

type VerifyingType = 'email' | 'phone'

export interface IUser {
    _id?: string | ObjectId
    fullname: string
    birthday: string
    username: string
    password: string
    email: string
    phone: string
    role: string
    joinDatetime: string
}