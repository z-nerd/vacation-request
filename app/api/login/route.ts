import { Check } from "@/lib/check"
import { ErrorHandler } from "@/lib/error"
import { UserService } from "@/lib/service"
import { NextRequest, NextResponse } from "next/server"


export async function POST(request: NextRequest) {
    const userService = new UserService()
    const { apiKey, ip, ua, spam } = Check({ request, method: 'POST', subject: 'users' })

    try {
        await spam(10, 60, [120, 240])

        const body = await request.json()
        const result = await userService.login(body)
        
        
        return NextResponse.json(result)
    } catch (error: unknown) {
        const {status, ...handler} = ErrorHandler(error, apiKey, ip, ua)

        return NextResponse.json(handler, { status })
    }
}


export const revalidate = 0