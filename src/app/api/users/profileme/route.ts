import User from "@/models/userModel";
import { connectDb } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectDb()


export async function POST(request: NextRequest){

      // extract data from token
      // utility function getDataFromToken

    try {

     const userId =   await getDataFromToken(request); 
     const user= User.findOne({_id: userId}).select("-password")

     //check if there is no user

     return NextResponse.json({
        message: "User found",
        data:user
     })
        
    } catch (error) {
        
        return NextResponse.json({ error}, { status:400})
    }
}