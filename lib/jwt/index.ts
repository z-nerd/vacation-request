import "server-only"

import { verify, sign, JwtPayload, VerifyErrors } from "jsonwebtoken"
import { AppError } from "../error"


if (!process.env.ACCESS_TOKEN_SECRET || 
    !process.env.REFRESH_TOKEN_SECRET) {
    throw new AppError({
        cause: { type: 'CONFIG', name: 'ENV' },
        status: 500,
        message: `Invalid/Missing environment variable: "ACCESS_TOKEN_SECRET" or "REFRESH_TOKEN_SECRET"`
    })
}


const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET


export const getRefreshToken= (
    payload: { username: any },
    refreshTokenExpiresIn = '30d',
) => {
    return sign({ username: payload.username }, refreshTokenSecret, { expiresIn: refreshTokenExpiresIn })
}

export const getAccessToken= <T> (
    payload: T & { username: any },
    accessTokenExpiresIn = '10m',
) => {
    return sign(payload, accessTokenSecret, { expiresIn: accessTokenExpiresIn })
}


export const decodAccessToken = <T> (token: string) => {
    let jwtPayload: T | undefined

    try {
        jwtPayload = verify(token, accessTokenSecret) as T
    } catch (e: any) {
        if (e.name === "TokenExpiredError")
            throw new AppError({
                cause: { type: 'JWT', name: 'TokenExpiredError' },
                status: 401,
                message: `TokenExpiredError`,
            })

        if (e.name === "JsonWebTokenError")
            throw new AppError({
                cause: { type: 'JWT', name: 'JsonWebTokenError' },
                status: 401,
                message: `JsonWebTokenError`,
            })

        if (e.name === "NotBeforeError")
            throw new AppError({
                cause: { type: 'JWT', name: 'NotBeforeError' },
                status: 401,
                message: `NotBeforeError: Thrown if current time is before the nbf claim.`,
            })
    }

    return jwtPayload
}


export const decodRefreshToken = (token: string) => {
    let jwtPayload

    try {
        jwtPayload = verify(token, refreshTokenSecret) as { username: string }
    } catch (e: any) {
        if (e.name === "TokenExpiredError")
            throw new AppError({
                cause: { type: 'JWT', name: 'TokenExpiredError' },
                status: 401,
                message: `TokenExpiredError`,
            })

        if (e.name === "JsonWebTokenError")
            throw new AppError({
                cause: { type: 'JWT', name: 'JsonWebTokenError' },
                status: 401,
                message: `JsonWebTokenError`,
            })

        if (e.name === "NotBeforeError")
            throw new AppError({
                cause: { type: 'JWT', name: 'NotBeforeError' },
                status: 401,
                message: `NotBeforeError: Thrown if current time is before the nbf claim.`,
            })
    }

    return jwtPayload
}