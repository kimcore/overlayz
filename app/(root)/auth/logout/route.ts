import {NextRequest} from "next/server"
import {auth, getSession} from "@/auth/lucia"

export async function POST(request: NextRequest) {
    const {authRequest, session} = await getSession()
    if (!session) return new Response(null, {status: 401})

    const url = new URL(request.url)
    const redirect = url.searchParams.get("redirect") || request.headers.get("referer") || "/"

    const userId = session.user.userId

    await auth.invalidateSession(session.sessionId)
    authRequest.setSession(null)

    await auth.deleteDeadUserSessions(userId)

    return new Response(null, {
        status: 302,
        headers: {
            Location: redirect
        }
    })
}