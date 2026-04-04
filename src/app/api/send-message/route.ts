import UserModel  from "@/model/User";
import dbConnect from "@/lib/dbConnect";

import {Message} from "@/model/User";

export async function POST(request: Request) {

    await dbConnect();  
    // Note : message koi bhi bhej sakta hai 

    const { username , content }= await request.json() // extract username and content from the request body

    try {
        const user = await UserModel.findOne({username: username}) 
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found with the provided username"
                },
                {status: 404} 
            )           
        }

        // is user accepting the message 
        
      if(!user.isAcceptingMessage){

         return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages at the moment"
                },
                {status: 403} 
            )   
      } 

      const newMessage = { content , createdAt: new Date()}
      user.messages.push(newMessage as Message) // push the new message to the user's messages array

      await user.save()

      return Response.json(
                {
                    success: true,
                    message: "Message sent successfully"
                },
                {status: 200} 
            )   
   }catch(error){ 
    
        console.error("Error while sending message:", error);
        return Response.json(
            {
                success: false,
                message: "Failed to send message"
            },
            {status: 500} 
        )       

    }

}    

