import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

import { User} from "next-auth"; 

export async function POST(request: Request) {

    await dbConnect();  

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User // type assertion to treat session.user as a User object from next-auth, which should have the properties we need like email or id.

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Unauthorized user "
            },
            {status: 401} 
        )       
    }  
    
    const userId = user._id; 
    const {acceptMessages} =await request.json() // extract the acceptMessages value from the request body
    

    try {

       const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {acceptMessages: acceptMessages},
            {new: true} // return the updated document
        )  

        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status to accept messages"
                },
                {status: 401} 
            )       
        }  else {
            return Response.json(
                {
                    success: true,
                    message: "Message acceptance status updated successfully",
                    updatedUser
                },
                {status: 200} 
            )   


        } 



        
        

    } catch(error){
        console.error("Failed to update user status to accept messages ", error);
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages"
            },
            {status: 500} 
        )
    }


}    

export async function GET(request: Request) {

     

    await dbConnect();  

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User // type assertion to treat session.user as a User object from next-auth, which should have the properties we need like email or id.

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Unauthorized user "
            },
            {status: 401} 
        )       
    }  
    
    const userId = user._id; 

  try{
     const foundUser =await UserModel.findById(userId)
    if(!foundUser){ 
        return Response.json(
            {
                success: false,
                message: "User not found"
            },
            {status: 404} 
        )       
    }

    return Response.json(
            {
                success: true ,
                isAcceptingMessages: foundUser.isAcceptingMessage   
            },
            {status: 200} 
        )   
    
   } catch(error){
    console.error("Failed to update user status to accept messages  ", error);
    return Response.json(
        {
            success: false,
            message: "Errors in getting message acceptance status"
        },
        {status: 500} 
    )
   }     
}    
