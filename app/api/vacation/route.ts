import { NextRequest, NextResponse } from "next/server"
import { UserService, VacationService } from "@/lib/service"
import { Check } from "@/lib/check"
import { ErrorHandler } from "@/lib/error"


export async function GET(request: NextRequest, {params}: {params:{id: string}}) {
    const vacationService = new VacationService()
    const { apiKey, ip, ua, spam, auth } = Check({ request, method: 'POST', subject: 'vacation' })

    try {
        await spam(10, 60, [120, 240])
        const tUser = await auth(['admin', 'manager'])

        const result =  await vacationService.getWaitingRequest(tUser)
    
        return NextResponse.json(result)
    } catch (error: unknown) {
            const {status, ...handler} = ErrorHandler(error, apiKey, ip, ua)
    
            return NextResponse.json(handler, { status })
    }
}


export async function POST(request: NextRequest) {
    const vacationService = new VacationService()
    const { apiKey, ip, ua, spam, auth } = Check({ request, method: 'POST', subject: 'vacation' })

    try {
        await spam(2, 60, [120, 240])

        const tUser = await auth(['admin', 'manager', 'user'])
        const body = await request.json()

        const result = await vacationService.request(body, tUser)
    
        return NextResponse.json(result)
    } catch (error: unknown) {
            const {status, ...handler} = ErrorHandler(error, apiKey, ip, ua)
    
            return NextResponse.json(handler, { status })
    }
}


// export async function DELETE(request: NextRequest, {params}: {params:{id: string}}) {
//     const userService = new UserService()
//     const { apiKey, ip, ua, spam, auth } = Check({ request, method: 'DELETE', subject: 'users' })

//     try {
//         await spam(2, 60, [120, 240])

//         const user = await userService.deleteById(params.id)
    
//         return NextResponse.json(user)
//     } catch (error: unknown) {
//             const {status, ...handler} = ErrorHandler(error, apiKey, ip, ua)
    
//             return NextResponse.json(handler, { status })
//     }
// }


export const revalidate = 0