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





    } catch(error){
        console.error("Error registering user ",error);
        return Response.json(
            {
                success:false ,
                 message:'Error registering user'}, 
                 {status:500   })
    }
    

}    


