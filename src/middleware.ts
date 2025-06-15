import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl
    const isAdmin = token?.role === "Admin"
    const isVolunteer = token?.role === "Volunteer"
    const isAdminRoute = url.pathname.startsWith("/dashboard/admin")
    const isVolunteerRoute = url.pathname.startsWith("/dashboard/volunteer")

    // Public paths that don't require authentication
    const isPublicPath = url.pathname === '/sign-in' || url.pathname === '/sign-up'

    // If user is not logged in and tries to access protected pages, redirect to sign-in
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // If user is logged in and tries to access auth pages, redirect to appropriate dashboard
    if (token && isPublicPath) {
        if (isAdmin) {
            return NextResponse.redirect(new URL('/dashboard/admin', request.url))
        } else if (isVolunteer) {
            return NextResponse.redirect(new URL('/dashboard/volunteer', request.url))
        }
    }

    // Role-based access control
    if (isAdminRoute && !isAdmin) {
        return NextResponse.redirect(new URL('/dashboard/volunteer', request.url))
    }

    if (isVolunteerRoute && !isVolunteer) {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/dashboard/:path*',
    ]
}

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const isAdmin = token?.role === "Admin"
        const isVolunteer = token?.role === "Volunteer"
        const isAdminRoute = req.nextUrl.pathname.startsWith("/dashboard/admin")
        const isVolunteerRoute = req.nextUrl.pathname.startsWith("/dashboard/volunteer")

        // Redirect if trying to access admin routes without admin role
        if (isAdminRoute && !isAdmin) {
            return NextResponse.redirect(new URL("/dashboard/volunteer", req.url))
        }

        // Redirect if trying to access volunteer routes without volunteer role
        if (isVolunteerRoute && !isVolunteer) {
            return NextResponse.redirect(new URL("/dashboard/admin", req.url))
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)