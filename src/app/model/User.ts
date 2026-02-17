import mongoose , { Schema , Document} from "mongoose";  // Document for type safety

export interface Message extends Document {  // like a custom data type 
    content: string; // In typeScript , string , it written with small letter s 
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true


    }, 

    createdAt:{
        type: Date , 
        required: true, 
        default: Date.now 
    }
})


export interface User extends Document {  
    username: string; 
    email: string; 
    password: string; 
    verifyCode: string; 
    verifyCodeExpiry: Date; 
    isVerified: boolean; 
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
   username:{
    type: String,
    required: [true, "Username is required"],
    trim: true, 
    unique: true  

    

   }, 

   email: {
    type: String, 
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, 'please use a valid email address'] // usung simple regex r for email validation 

   },

   password:{
    type: String,
    required: [true, "Password is required"], 
   },

    verifyCode:{
    type: String,
    required: [true, "Verify code is required"], 
   },

   verifyCodeExpiry:{
    type: Date,
    required: [true, "Verify code Expiry is required"], 
   }, 

   isVerified:{
    type: Boolean,
    default: false
    
   },

   isAcceptingMessage:{
    type: Boolean,
    default: true
    
   },

   messages: [MessageSchema]


})

// Note: In next js , max code run on edge // 

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel; 
