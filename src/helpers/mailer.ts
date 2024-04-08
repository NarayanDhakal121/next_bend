import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                }
            });
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                }
            });
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: "maddison53@ethereal.email",
                pass: "jn7jnAPss4f63QBp6D",
            },
        });

        const mailOptions = {
            from: 'narine@narine.ai', // sender address
            to: email,
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.Domain}/verifyemail?token=${hashedToken}">Here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in the browser
            <br>${process.env.domain}/verifyemail?token=${hashedToken}
            </p>`, // html body
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error:any) {
        throw new Error(error.message);
    }
};
