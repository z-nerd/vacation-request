import { NextRequest } from "next/server"
import { BlockSpamService } from "../service"
import { AppError } from "../error"
import { IUser } from "@/sdk/model"
import { decodAccessToken } from "@/lib/jwt"

export interface CheckProps {
    request: NextRequest
    method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'
    subject: 'users' | 'init' | 'vacation'
}

export const Check = (checkApiProps: CheckProps) => {
    const blockSpamService = new BlockSpamService()
    const apiKey = `${checkApiProps.method}-${checkApiProps.request.nextUrl.pathname}`
    const ip = checkApiProps.request.ip || checkApiProps.request.headers.get('host') || ''
    const ua = checkApiProps.request.headers.get('user-agent') || ''
    const token = checkApiProps.request.headers.get('token')


    const spam = async (totallCall: number,
        totallCallDuration: number,
        blockDuration: number[],
        blockIpCountTtl?: number) => {
        const spamCheck = await blockSpamService.check(apiKey, ip, totallCall, totallCallDuration)


        if (spamCheck?.isBlock)
            throw new AppError({
                cause: { type: 'BLOCK', count: spamCheck.count + 1, duration: spamCheck.ttl },
                status: 500,
                message: `You are block for ${spamCheck.ttl} sec!`,
            })

        if (spamCheck?.isSpam) {
            const [duration, count] = await blockSpamService.block(apiKey, ip, blockDuration, blockIpCountTtl)

            throw new AppError({
                cause: { type: 'BLOCK', count: count + 1, duration },
                status: 500,
                message: `You are block for ${duration} sec!`,
            })
        }
    }


    const auth = async (roles: string[],) => {
        if(token !== undefined &&
           token !== null) {
            const tUser = decodAccessToken<IUser>(token)

            if(tUser) 
                if(roles.includes(tUser.role)) 
                    return tUser
        }

        throw new AppError({
            cause: { type: 'AUTH', name: 'FORBIDDEN' },
            message: "You aren't allow to do this",
            status: 403,
        })


        // checkApiProps.subject

        // if (typeof rule[checkApiProps.method] === 'boolean') valdate = rule[checkApiProps.method] as boolean

        // else if (typeof rule[checkApiProps.method] === 'object') {
        //     try {
        //         valdate = new Query(JSON.parse((rule[checkApiProps.method] as any).validator)).test(doc)
        //     } catch (error) {
        //         throw new AppError({
        //             cause: { type: 'AUTH', name: 'PARSERULE', rule },
        //             status: 403,
        //             message: error,
        //         })
        //     }
        // }


        // if (!valdate)
        //     throw new AppError({
        //         cause: { type: 'AUTH', name: 'FORBIDDEN', rule },
        //         status: 403,
        //         message: rule[checkApiProps.method],
        //     })
    }

    return { apiKey, ip, ua, token, blockSpamService, spam, auth }
}
