
import { NextRequest, NextResponse} from 'next/server';
import { connectDb } from "@/dbConfig/dbConfig";


connectDb()

export async function GET(request: NextRequest){

    try {
           const response = NextResponse.json({
            message:"Logout Successfully",
            suscess: true
        })

   response.cookies.set("token",  '', {
    httpOnly: true,
    expires: new Date(0)
})

return response

    } catch (error:any) {
        return NextResponse.json({error:error.message}, {status:500});
    }

}