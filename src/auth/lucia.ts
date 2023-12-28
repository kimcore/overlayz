import {lucia} from "lucia"
import "lucia/polyfill/node"
import {nextjs} from "lucia/middleware"
import {__PROD__} from "@/utils/consts"
import postgres from "postgres"
import {postgres as postgresAdapter} from "@lucia-auth/adapter-postgresql"
import {twitch} from "@lucia-auth/oauth/providers"
import {cookies} from "next/headers"
import {NextRequest} from "next/server"

let sql: ReturnType<typeof postgres> = global.sql

if (!sql) {
    sql = global.sql = postgres(process.env.DATABASE_URL)
}

export const auth = lucia({
    env: __PROD__ ? "PROD" : "DEV",
    middleware: nextjs(),
    sessionCookie: {
        name: "overlayz_session",
        expires: false
    },
    adapter: postgresAdapter(sql, {
        user: "users",
        key: "keys",
        session: "sessions"
    }),
    getUserAttributes: databaseUser => databaseUser
})

export const twitchAuth = (request: NextRequest) => {
    const prefix = __PROD__ ?
        `https://overlayz.kr` :
        `${request.url.split(":")[0]}://${request.headers.get("host")}`
    return twitch(auth, {
        clientId: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
        redirectUri: `${prefix}/auth/callback/twitch`,
        scope: []
    })
}

export async function getSession() {
    const authRequest = auth.handleRequest({request: null, cookies})
    const session = await authRequest.validate()

    return {authRequest, session}
}