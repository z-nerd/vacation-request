import { Check } from "@/lib/check"
import { ErrorHandler } from "@/lib/error"
import { UserService } from "@/lib/service"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    const userService = new UserService()
    const { apiKey, ip, ua, spam } = Check({ request, method: 'POST', subject: 'users' })

    try {
        await spam(3, 60, [120, 240])
        
        const headers =  {
            id: request.headers.get('id') || '',
            code: request.headers.get('code') || '',
        }

        const result = await userService._2fa(headers)

        return NextResponse.json(result)
    } catch (error: unknown) {
        const {status, ...handler} = ErrorHandler(error, apiKey, ip, ua)

        return NextResponse.json(handler, { status })
    }
}


export const revalidate = 0