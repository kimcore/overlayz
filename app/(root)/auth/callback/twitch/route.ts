import {NextRequest, NextResponse} from "next/server"
import {auth, getSession, twitchAuth} from "@/auth/lucia"
import {cookies} from "next/headers"
import {OAuthRequestError} from "@lucia-auth/oauth"

export async function GET(request: NextRequest) {
    const {authRequest, session} = await getSession()
    if (session) return NextResponse.redirect("/")

    const cookieStore = cookies()
    const storedState = cookieStore.get("overlayz_oauth_state")?.value
    const referer = cookieStore.get("overlayz_oauth_referer")?.value

    const url = new URL(request.url)
    const state = url.searchParams.get("state")
    const code = url.searchParams.get("code")

    if (!storedState || !state || storedState !== state || !code) {
        return new Response(null, {status: 400})
    }

    try {
        const {
            getExistingUser,
            createUser,
            twitchUser
        } = await twitchAuth(request).validateCallback(code)

        const getUser = async () => {
            const existingUser = await getExistingUser()
            if (existingUser) return existingUser
            return createUser({
                attributes: {
                    twitch: twitchUser.id
                }
            })
        }

        const user = await getUser()
        const session = await auth.createSession({
            userId: user.userId,
            attributes: {}
        })
        authRequest.setSession(session)

        await auth.deleteDeadUserSessions(user.userId)

        return new Response(null, {
            status: 302,
            headers: {
                Location: referer || "/"
            }
        })
    } catch (e) {
        if (e instanceof OAuthRequestError) {
            return new Response(null, {status: 400})
        }

        throw e
    }
}