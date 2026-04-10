import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {  // Note : UI Bhi next auth bna leta hai 
    providers:[
        CredentialsProvider({   
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "email", type: "text", placeholder: "Enter your email" },  
                password: { label: "Password", type: "password", placeholder: "Enter your password" },

            },
            async authorize(credentials:any):Promise<any> {

                await dbConnect();

                try{
                    const user =await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
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
                        return user  // NOte return going to providers
                       
                    }else{
                        throw new Error("Invalid password")
                    }

                    

                }catch(err:any){
                    throw new Error(err.message)
                }
            }    
        })
    ],
    callbacks:{
        async jwt({token ,user}){
            // making token powerful , since bydefault token has username and email but we want to add more info in token like id and isVerified

            if(user){
                token._id = user._id?.toString()  // since _id is an object we need to convert it to string
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }

            return token 
        },
        async session({session,token}){
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        
        },

    },
    pages:{
        //signIn:"/auth/signin", // It can be override
        signIn:'/sign-in' , // we dont have to design the page saparately for this 

    }, 
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,

    
}        