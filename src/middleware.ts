import { NextRequest , NextResponse } from "next/server";

// import type { NextRequest } from "next/server";
export {default} from "next-auth/middleware"
import {getToken }  from "next-auth/jwt"
//import { request } from "http";

// It is main function 

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();

}
// Config - Yeh btata hai ki middleware kin routes pr apply hoga , yaha humne /api/auth/* pr apply kiya hai , iska matlab hai ki ye middleware /api/auth ke sare routes pr apply hoga
export const config = {
    matcher: [
       '/sign-in',
       '/sign-up',
       '/',
       '/dashboard/:path*',
       '/verify/:path*'


    
    ],   // Note : yaha :path* ka matlab hai ki ye middleware /api/auth ke sare routes pr apply hoga , chahe wo /api/auth/login ho ya /api/auth/register ho ya koi aur route ho
}