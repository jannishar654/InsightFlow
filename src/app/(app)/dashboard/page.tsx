'use client'

import { Message } from '@/model/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

import { useSession } from 'next-auth/react';
import React, { useCallback } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from "sonner"


const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);  

  const handleDeleteMessage = (messageId:string) =>{
    setMessages(messages.filter((message) => message._id.toString() !== messageId)) // UI se message ko remove karna
    
  }

  const {data:session} = useSession()
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const {register,watch ,setValue} = form ; 

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptedMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage) // form ke acceptMessages field ko update karna  // immediate set in ui 



    } catch(error){
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(
        axiosError.response?.data.message || "Failed to update message settings"
      );


    } finally {
      setIsSwitchLoading(false)
      
    }
  }, [setValue])

  return (
    <div>page</div>
  )
}

export default page