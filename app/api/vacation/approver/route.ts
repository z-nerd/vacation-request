import { NextRequest, NextResponse } from "next/server"
import { UserService, VacationService } from "@/lib/service"
import { Check } from "@/lib/check"
import { ErrorHandler } from "@/lib/error"


export async function POST(request: NextRequest) {
    const vacationService = new VacationService()
    const { apiKey, ip, ua, spam, auth } = Check({ request, method: 'POST', subject: 'vacation' })

    try {
        await spam(2, 60, [120, 240])

        const tUser = await auth(['admin', 'manager'])

        const status = request.headers.get('status') || ''
        const id = request.headers.get('id') || ''

        const result = await vacationService.approver(id, status)
    
        return NextResponse.json(result)
    } catch (error: unknown) {
            const {status, ...handler} = ErrorHandler(error, apiKey, ip, ua)
    
            return NextResponse.json(handler, { status })
    }
}


export const revalidate = 0