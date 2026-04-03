import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import {z} from "zod";

import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation  // username should be validated according to the same rules as in the sign-up schema, we can reuse the validation logic from there.
})  

export async function GET(request: Request) {   

    await dbConnect();  
    // url sample : http://localhost:3000/api/check-username-unique?username=johndoe?phone= ==... anything , any no. of paramaters 

    try {

        const {searchParams} = new URL(request.url)

        const queryParam ={
            username: searchParams.get("username") 
        }

        // validate with zod
       const result = UsernameQuerySchema.safeParse(queryParam)  // since we are not throwing error we can use safeParse instead of parse
         if(!result.success){   
            const usernameErrors = result.error.format().username?._errors || []// empty array if no error
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length>0
                    ? usernameErrors.join(',')
                    :"Invalid query parameters", 
                },
                {status: 400}
            )       
         }
        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username:username, isVerified:true})

        if(existingVerifiedUser){
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {status: 400} 
            )       
        }

        return Response.json(
                {
                    success: true,
                    message: "Username is available"
                },
                {status: 400} 
            )  




    } catch(error){
        console.error("Error checking username uniqueness", error);

        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {status: 500}
        )       

    }

}

