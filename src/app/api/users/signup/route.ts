
import User from '../../../../models/userModel';
import { NextRequest, NextResponse} from 'next/server';
import { connectDb } from "@/dbConfig/dbConfig";
import bcryptjs from 'bcryptjs';
import { sendEmail } from "@/helpers/mailer";

connectDb()

export async function POST(request: NextRequest, response: NextResponse){
    try {
    const reqBody = await  request.json()
    const {username, email, password} = reqBody
    //validation
    console.log(reqBody);

    // user reg

 const user = await User.findOne({email})

 if(user){
    return NextResponse.json({error :'user already exists'}, {status: 400})
 }

  const salt  =  await bcryptjs.genSaltSync(10);
  const hashedPassword = await bcryptjs.hash(password, salt)


        // save the user

        const newUser =  new User({
            username,
            email,
            password:hashedPassword
        })

        const savedUser = await newUser.save();
        console.log(savedUser);


        // send verification email

        await sendEmail({email, emailType:' VERIFY', userId:savedUser._id})

        return NextResponse.json({message:'user registered suscessfully',
        suscess: true,
        savedUser
    })

        
    } catch (error: any) {
        return NextResponse.json({error: error.messsage}, {status:500});
  
    }

}

