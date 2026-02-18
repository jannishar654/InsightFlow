import {z} from "zod"

export const signInSchema = z.object({
    identifier: z.string(), // identifier word used in production , it can be email etc 
    password:z.string()
})