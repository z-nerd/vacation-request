import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";



export async function GET(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("ecommerce");
        

        const suspicious = await db
            .collection("suspicious")
            .find({})
            // .sort({ startTime: -1 })
            // .limit(10)
            .toArray()

        return NextResponse.json(suspicious)
    } catch (e) {
        console.error("Zero Error: ", e);
    }

    // const token = getToken({username: 'zero', email: 'zero@zero.com', isAdmin: true, age: 28})
    // const decod1 = decodAccessToken(token.accessToken)
    // const decod2 = decodRefreshToken(token.refreshToken)



    // if(!!decod1){
    //    console.log(decod1);
    // }

    // if(!!decod2){
    //     console.log(decod2);
    // }

    // return NextResponse.json(token)
}

export const revalidate = 0
export const dynamic = 'force-dynamic'