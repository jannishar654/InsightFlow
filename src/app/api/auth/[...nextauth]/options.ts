import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({   
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "Enter your email" },  
                password: { label: "Password", type: "password", placeholder: "Enter your password" },

            },
            async authorize(credentials:any):Promise<any> {

                await dbConnect();

                try{
                    const user =await UserModel.findOne({
                        $or:[
                            {email:credentials.email},
                            {username:credentials.password}
                        ]
                    })

                    if(!user){
                        throw new Error("No user found with the provided email or username")    
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your email before logging in")
                    }   

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect){
                        return user
                       
                    }else{
                        throw new Error("Invalid password")
                    }

                    

                }catch(err:any){
                    throw new Error(err.message)
                }
            }    
        })
    ] 
}        