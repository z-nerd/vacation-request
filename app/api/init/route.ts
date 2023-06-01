import { Check } from "@/lib/check"
import { AppError, ErrorHandler } from "@/lib/error"
import { CrudService, UserService } from "@/lib/service"
import { NextRequest, NextResponse } from "next/server"
import { IUser, IVacation } from "@/sdk/model"
import { genSaltSync, hashSync } from "bcrypt"

export async function POST(request: NextRequest) {
    const { apiKey, ip, ua, spam } = Check({ request, method: 'POST', subject: 'init' })
    const  crudService = new CrudService();

    try {
        await spam(3, 60, [120, 240])

        const isAdminExist = await crudService.find<IUser>(
            'vacation-request',
            'users',
            { username: 'admin' }
        )

        if(isAdminExist) 
            throw new AppError({
                cause: {
                    type: 'ININT',
                    name: 'init-not-needed'
                },
                status: 500,
                message: `Initialization have been done once!`,
            })


        const usernameIndex = await crudService.createIndex<IUser>(
            'vacation-request',
            'users',
            { username: 1 },
            { unique: true })
        
        
        const emailIndex = await crudService.createIndex<IUser>(
            'vacation-request',
            'users',
            { email: 1 },
            { unique: true })

        
        const phoneIndex = await crudService.createIndex<IUser>(
            'vacation-request',
            'users',
            { phone: 1 },
            { unique: true })
        
        
        const statusIndex = await crudService.createIndex<IVacation>(
            'vacation-request',
            'vacation',
            { status: 1 },
            { unique: false })
        
        
        const adminUser = await crudService.create<IUser>(
            'vacation-request',
            'users',
            {
                fullname: 'admin',
                username: 'admin',
                password: hashSync('Admin123!', genSaltSync(10)),
                email: 'admin@admin.com',
                phone: '09123456789',
                birthday: new Date().toISOString(),
                role: 'admin',
                joinDatetime: new Date().toISOString(),
            }
        )
        

        return NextResponse.json({usernameIndex, emailIndex, phoneIndex, statusIndex, adminUser})
    } catch (error: unknown) {
        const {status, ...handler} = ErrorHandler(error, apiKey, ip, ua)

        return NextResponse.json(handler, { status })
    }
}


export const revalidate = 0