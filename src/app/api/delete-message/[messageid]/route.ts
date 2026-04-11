import { getServerSession } from "next-auth";

import { authOptions } from "../../auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

import { User} from "next-auth"; 
import mongoose from "mongoose";


export async function DELETE(request: Request, {params}:{params:{messageid: string}}) {
    const messageId = params.messageid; // frontend se URL ke through messageId mil jayega, usko params se extract karna hoga
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

    try{

        const updateResult= await UserModel.updateOne(
            {_id: user._id}, // user ke id ke basis pe document find karna hoga
            {$pull: {messages: {_id:messageId}} } // $pull operator ka use karna hoga messages array me se us message ko remove karne ke liye jiska _id messageId ke barabar hai

        )
        if(updateResult.modifiedCount === 0){
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted"
                },
                {status: 404} 
            )       
        }

        return Response.json(
                {
                    success: true,
                    message: "Message deleted successfully"
                },
                {status: 200} 
            ) 

    } catch(error){
        console.error("Error while deleting message:", error);
        return Response.json(
                {
                    success: false,
                    message: "Error while deleting message"
                },
                {status: 500} 
            ) 


    }
   

    

    
    
}    