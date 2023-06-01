import { ObjectId } from "mongodb"


export interface IVacation {
    _id?: string | ObjectId
    fullname: string
    from: string
    to: string
    description: string
    status: 'rejected' | 'accepted' | 'waiting'
    requestedDatetime: string
}