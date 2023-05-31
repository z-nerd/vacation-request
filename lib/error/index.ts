import { MongoServerError } from "mongodb"


interface IAppErrorCauseConfig {
    type: 'CONFIG'
    name: 'ENV'
}

type IAppErrorCauseInit = {
    type: 'ININT'
    name: 'init-not-needed'
}

interface IAppErrorCauseValidation {
    type: 'VALIDATION'
    value: any
}

interface IAppErrorCauseBlock {
    type: 'BLOCK'
    count: number
    duration: number
}

interface IAppErrorCauseMongodb {
    type: 'MONGODB'
    result: any
}

interface IAppErrorCauseJwt {
    type: 'JWT'
    name: 'TokenExpiredError' |
    'JsonWebTokenError' |
    'NotBeforeError'
}

//---------- IAppErrorCauseAuthLogin ----------
interface IAppErrorCauseAuthLogin {
    type: 'AUTH'
    name: 'LOGIN'
    incorrect: 'username' | 'password'
}

interface IAppErrorCauseAuth2FA {
    type: 'AUTH'
    name: '2FA'
}

interface IAppErrorCauseAuthForbidden {
    type: 'AUTH'
    name: 'FORBIDDEN' | 'PARSERULE'
    rule?: string
}

type IAppErrorCauseAuth = IAppErrorCauseAuthLogin |
IAppErrorCauseAuth2FA |
IAppErrorCauseAuthForbidden
//----------  ----------

type IAppErrorCause = IAppErrorCauseConfig |
    IAppErrorCauseInit |
    IAppErrorCauseValidation |
    IAppErrorCauseBlock |
    IAppErrorCauseMongodb |
    IAppErrorCauseJwt |
    IAppErrorCauseAuth

export interface IAppError {
    message: any
    status: number
    cause: IAppErrorCause
}

export class AppError extends Error {
    name: 'AppError'
    message: any
    status: number
    cause: IAppErrorCause

    constructor({ message, status, cause }: IAppError) {
        super()
        this.name = 'AppError'
        this.message = message
        this.status = status
        this.cause = cause
    }
}


type ErrorType = 'AppError' |
    'MongoServerError' |
    'SyntaxError' |
    'InternalServerError'

interface ErrorIdentifierResult {
    status: number
    type: ErrorType
    name: string
    message: any
    cause: any
    stack: any
    createDate: string
}


export const ErrorIdentifier = (error: any): ErrorIdentifierResult => {
    let status: number, type: ErrorType

    if (error instanceof AppError) {
        status = error.status
        type = 'AppError'
    } else if (error instanceof MongoServerError) {
        status = 500
        type = 'MongoServerError'
    } else if (error instanceof SyntaxError) {
        status = 400
        type = 'SyntaxError'
    } else {
        status = 500
        type = 'InternalServerError'
    }

    return {
        status,
        type,
        name: error.name,
        message: error.message,
        cause: error.cause,
        stack: error.stack,
        createDate: new Date().toISOString()
    }
}


export const ErrorHandler = (
    err: any,
    apiKey: string,
    ip: string,
    ua: string,
) => {
    const { status, ...identifier } = ErrorIdentifier(err)

    const error = {
        ...identifier
    }

    return { status, error }
}


export const validation = (vlidatorFun: Function, value: any) => {
    const errors = vlidatorFun(value)

    if (errors && Object.keys(errors).length > 0)
        throw new AppError({
            cause: { type: 'VALIDATION', value },
            status: 400,
            message: errors,
        })
}