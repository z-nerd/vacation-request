import { decodRefreshToken, getAccessToken } from "@/lib/jwt"
import { Check } from "@/lib/check"
import { ErrorHandler } from "@/lib/error"
import { UserService } from "@/lib/service"
import { NextRequest, NextResponse } from "next/server"


export async function POST(request: NextRequest) {
    const userService = new UserService()
    const { apiKey, ip, ua, spam } = Check({ request, method: 'POST', subject: 'users' })

    try {
        await spam(25, 60, [120, 240])
        const token = request.headers.get('r-token') || ''
        const rUser = decodRefreshToken(token)

        if(rUser){
            const user = await userService.findByUsername(rUser)

            if(user) {
                const { _id, username, role, email, fullname, phone, joinDatetime, birthday } = user

                return NextResponse.json({
                    accessToken: getAccessToken({ 
                        username, role, _id, email, fullname, phone, joinDatetime, birthday }),
                        userInfo: {
                            _id, 
                            fullname, 
                            username, 
                            role, 
                            email, 
                            phone, 
                            birthday,
                            joinDatetime, 
                        } 
                    })
            }
        }
    } catch (error: unknown) {
        const {status, ...handler} = ErrorHandler(error, apiKey, ip, ua)

        return NextResponse.json(handler, { status })
    }
}


export const revalidate = 0