'use-client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import {useDebounceValue} from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from "next/dist/client/components/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios ,  { AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { set } from "mongoose"

const page = () => {
  const [username , setUsername] = useState("")
  const[usernameMessage, setUsernameMessage] = useState("")
  const[isCheckingUsername, setIsCheckingUsername] = useState(false)
  const[isSubmitting, setIsSubmitting] = useState(false)  

  const debouncedUsername = useDebounceValue(username,300) // immediately value change nhi kar rahe ,debounced ke according chnage kar rahe jai 
   const router = useRouter()

   // ZOD Implementation 

   const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username: "",
      email: "",
      password: ""
    }
   })

   

   useEffect(() => {

    const checkUsernameUnique = async () =>{
      if(debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage("")

        try {
         const response =  await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)

         setUsernameMessage(response.data.message)


        }catch(error){

          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message || "Error checking username uniqueness")



        } finally {
          setIsCheckingUsername(false)  // error ho yaa naa hoo yeh toh run hona hi chahiye 
        }

      }
    }
    
    checkUsernameUnique()
   },[debouncedUsername]) 


   //on submit ke andar data milta hai , jo lki handle submit se milta hai

   const onSubmit = async (data: z.infer<typeof signUpSchema>) =>{

    setIsSubmitting(true)

    try{

      const response = await axios.post<ApiResponse>('/api/sign-up',data)
      toast[response.data.success ? "success" : "error"](
      response.data.success ? "Success" : "Error",
      {
        description: response.data.message,
      }) 

      router.replace(`/verify/${username}`)
      setIsSubmitting(false)

    } catch(error){

      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message 
      toast.error("Signup failed", {
         description: errorMessage,
      })

      setIsSubmitting(false)

    }

   }



   


  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
    
    <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Join Mystery Message
      </h1>
      <p className="mb-4">
        Sign up to start your anonymous adventure
      </p>
    </div>

  </div>
</div>
  )   
} 

export default page