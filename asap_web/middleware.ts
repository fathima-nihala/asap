// import { NextRequest } from "next/server";
// import { DEFAULT_LOGIN_REDIRECT, authRoutes, publicRoutes } from "./routes";

// export function middleware(req: NextRequest) {
//   const { nextUrl, cookies } = req;
//   const qid = cookies.get("qid"); //change the qid to teh variabel used to store teh value
//   const isLoggedIn = !!qid?.value;
//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname);
//   //   if (isAuthRoute && isLoggedIn) {
//   //     return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//   //   }
//   //   if (!isLoggedIn && !isPublicRoute) {
//   //     return Response.redirect(new URL(`/auth/login`));
//   //   }
// }


// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const pathname = request.nextUrl.pathname
  
  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register']
  
  // Check if the requested path is public
  const isPublicPath = publicPaths.includes(pathname)

  // If there's no token and the path is not public, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If there's a token and trying to access login/register, redirect to dashboard
  if (token && isPublicPath && pathname !== '/') {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
