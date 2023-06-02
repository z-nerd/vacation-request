import { NextRequest, NextResponse } from "next/server"
import { VacationService } from "@/lib/service"
import { Check } from "@/lib/check"
import { ErrorHandler } from "@/lib/error"


export async function GET(request: NextRequest, {params}: {params:{id: string}}) {
    const vacationService = new VacationService()
    const { apiKey, ip, ua, spam, auth } = Check({ request, method: 'POST', subject: 'vacation' })

    try {
        await spam(2, 60, [120, 240])

        const tUser = await auth(['admin', 'manager', 'user'])

        const result = await vacationService.findById(params.id)
    
        return NextResponse.json(result)
    } catch (error: unknown) {
            const {status, ...handler} = ErrorHandler(error, apiKey, ip, ua)
    
            return NextResponse.json(handler, { status })
    }
}


export const revalidate = 0