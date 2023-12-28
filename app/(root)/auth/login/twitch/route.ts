import {NextRequest, NextResponse} from "next/server"
import {getSession, twitchAuth} from "@/auth/lucia"
import {__PROD__} from "@/utils/consts"

export async function GET(request: NextRequest) {
    const {session} = await getSession()
    if (session) return new Response(null, {status: 302, headers: {Location: "/"}})

    const referer = request.headers.get("referer")

    const [url, state] = await twitchAuth(request).getAuthorizationUrl()

    const response = NextResponse.redirect(url)

    response.cookies.set("overlayz_oauth_state", state, {
        httpOnly: true,
        secure: __PROD__,
        path: "/",
        maxAge: 60 * 60
    })

    if (referer) {
        response.cookies.set("overlayz_oauth_referer", referer, {
            httpOnly: true,
            secure: __PROD__,
            path: "/",
            maxAge: 60 * 60
        })
    }

    return response
}