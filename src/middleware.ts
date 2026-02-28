import { NextRequest , NextResponse } from "next/server";

// import type { NextRequest } from "next/server";
export {default} from "next-auth/middleware"
import {getToken }  from "next-auth/jwt"
//import { request } from "http";

// It is main function 

export async function middleware(req:NextRequest){

    const token = await getToken({req})  
    const url =  req.nextUrl

    if(token && (
        url.pathname.startsWith('/sign-in')||
        url.pathname.startsWith('/sign-up')||
        url.pathname.startsWith('/verify')||
        url.pathname.startsWith('/')
        
    )
    ){
        return NextResponse.redirect(new URL("/dashboard", req.url)) 

    }

   return NextResponse.redirect(new URL("/home", req.url)) 
     // Note : yaha humne middleware ko /api/auth ke sare routes pr apply kiya hai , iska matlab hai ki ye middleware /api/auth ke sare routes pr apply hoga , chahe wo /api/auth/login ho ya /api/auth/register ho ya koi aur route ho

}


// Config - Yeh btata hai ki middleware kin routes pr apply hoga , yaha humne /api/auth/* pr apply kiya hai , iska matlab hai ki ye middleware /api/auth ke sare routes pr apply hoga
export const config = {
    matcher: [
       '/sign-in',
       '/sign-up',
       '/',
       '/dashboard/: path*',
       '/verify/:path*'


    
    ]  // Note : yaha :path* ka matlab hai ki ye middleware /api/auth ke sare routes pr apply hoga , chahe wo /api/auth/login ho ya /api/auth/register ho ya koi aur route ho
}