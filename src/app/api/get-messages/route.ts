import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

import { User} from "next-auth"; 
import mongoose from "mongoose";

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
    // Agar _id DB me ObjectId hai aur string pass karenge, to match nahi hoga
    // so for aggregation pipeline me bhi ObjectId hi pass karna hoga, isliye user._id ko ObjectId me convert karna hoga
    const userId = new mongoose.Types.ObjectId(user._id); 

    try {

        const user = await UserModel.aggregate([
            { $match: { _id: userId }  }, // {} pipeline
            { $unwind: "$messages" }, // messages array ko unwind karna hoga taki har message ek alag document ban jaye
            { $sort: { "messages.createdAt": -1 } }, // messages ko createdAt ke basis pe sort karna hoga taki latest message pehle aaye
            { $group:{ _id: "$_id", messages: { $push: "$messages" } } } // phir se group karna hoga taki user ke saare messages ek array me aa jaye    
        ])

        if( !user || user.length ===0){
            return Response.json(
                {
                    success: false,
                    message: "No messages found for the user"
                },
                {status: 404} 
            )       
        }

        return Response.json(
                {
                    success: true,
                    messages: user[0].messages
                },
                {status: 200} 
            )
    } catch(error){

    }

    
    
}    