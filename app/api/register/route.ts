import { Check } from "@/lib/check"
import { ErrorHandler } from "@/lib/error"
import { decodAccessToken } from "@/lib/jwt"
import { UserService } from "@/lib/service"
import { IUser } from "@/sdk/model"
import { NextRequest, NextResponse } from "next/server"


export async function POST(request: NextRequest) {
    const userService = new UserService()
    const { apiKey, ip, ua, spam, auth } = Check({ request, method: 'POST', subject: 'users' })

    try {
        await spam(2, 60, [120, 240])
        await auth(['admin'])

        const body = await request.json()
        const result = await userService.register(body)

        return NextResponse.json(result)
    } catch (error: unknown) {
        const {status, ...handler} = ErrorHandler(error, apiKey, ip, ua)

        return NextResponse.json(handler, { status })
    }
}


export const revalidate = 0