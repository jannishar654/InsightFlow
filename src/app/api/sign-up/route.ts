import dbConnect from "@/lib/dbConnect"; // Note: Db connection in each route 
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try{ // Note : Jab bhi data lena ho , toh await lagana hi lagana hai next.js me 
        const { email, username, password } = await request.json()
        const existingUserVerifiedByUsername= await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingUserVerifiedByUsername){
            return Response.json(
                {
                    success:false ,
                     message:'Username already exists'}, 
                     {status:400   })
        }

        const existingUserByEmail= await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
           if(existingUserByEmail.isVerified){
            return Response.json(
                {
                    success:false ,
                     message:'User already exists with this email'}, 
                     {status:400   })
           }else {
            const hasedPassword = await bcrypt.hash(password, 10)   
            existingUserByEmail.password = hasedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000) // 1 hour later

            await existingUserByEmail.save();
            
           }
        } else { // user ko create karna hai
            const hasedPassword = await bcrypt.hash(password, 10)

            const expiryDate = new Date(); // note : date is object here // so chahe const bhi ho to modify kar sakte hai 
            expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour later

           const newUser = new UserModel({
                username, 
                email, 
                password: hasedPassword, 
                verifyCode, 
                verifyCodeExpiry: expiryDate, 
                isVerified:false, 
                isAcceptingMessage: true,
                messages: []

            })

            await newUser.save()

            // send verification email

            const emailResponse =await sendVerificationEmail(
                email,
                username,
                    verifyCode
            )

            if(!emailResponse.success){
                return Response.json(
                    {
                        success:false,
                        message:emailResponse.message
                    },
                    {status:500}
                )
            }

            return Response.json(
                    {
                        success:true,
                        message:"User Registered successfully. Please verify your email"
                    },
                    {status:201}
                )




            }

    } catch(error){
        console.error("Error registering user ",error);
        return Response.json(
            {
                success:false ,
                 message:'Error registering user'}, 
                 {status:500   })
    }
    

}    


