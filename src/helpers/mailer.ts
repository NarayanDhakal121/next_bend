import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs'

export const sendEmail = async ({email, emailType, userId} : any)=>{

    try {
      
     const hashedToken = await bcryptjs.hash(userId.toString(), 10)

      if (emailType === 'VERIFY'){

     await User.findByIdAndUpdate(userId,
      {verifyToken: hashedToken, veriifyTokenExpiry: Date.now()+3600000})

      } else if (emailType === 'RESET'){
      
        await User.findByIdAndUpdate(userId,{ forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now()+3600000})


      }

        // const transporter = nodemailer.createTransport({
        //     host: "smtp.ethereal.email",
        //     port: 587,
        //     secure: false, // Use `true` for port 465, `false` for all other ports
        //     auth: {
        //       user: "maddison53@ethereal.email",
        //       pass: "jn7jnAPss4f63QBp6D",
        //     },
        //   });

        var transporter = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "4608b662d2e461",  //confidenciality - _ -
            pass: "65371c47693169" // confidenciality **
          }
        });

const mailOptions= {
            from: 'narine@narine.ai', // sender address
            to: email, 
            subject: emailType==='VERIFY' ? "Verify your emalil" : "Verify your password", 
            html:`<p> Click   <a  href ="${process.env.Domain}/verifyemail?token=${hashedToken}">Here</a> to $ {emailType === "VERIFY" ? "Verify your email" : "reset your password"} 
            or copy and paste the link brlow in the browser
            <br> ${process.env.domain}/verifyemail?token=${hashedToken}
            </p>`,   // html body
          };

       const mailResponse =    await transporter.sendMail(mailOptions)
           return mailResponse

        
    } catch (error:any) {
        throw new Error(error.message)
    }
}