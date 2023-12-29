import ChatBox, {ChatBoxProps} from "@/chat/chat-box"
import {ChatBoxConfig} from "@/app/o/config"
import {notFound} from "next/navigation"
import {getTwitchChannelBadges, getTwitchGlobalBadges, getTwitchUserById} from "@/utils/twitch"
import prisma from "@/database/prisma"
import "../chat.css"

export const dynamic = "force-dynamic"

export default async function ChatPage({params: {overlayId}}) {
    const {signal} = new AbortController()

    const overlay = await prisma.overlay.findFirst({
        where: {
            id: overlayId
        },
        include: {
            user: true
        }
    })

    if (!overlay) return notFound()

    const config = overlay.config as ChatBoxConfig

    const props: ChatBoxProps = {config}

    if (overlay.user.chzzk && config.showChzzk) {
        const channelId = overlay.user.chzzk

        const chatChannelId = await fetch(
            `https://api.chzzk.naver.com/polling/v1/channels/${channelId}/live-status`,
            {signal}
        ).then(r => r.json()).then(data => data['content']?.['chatChannelId'])

        if (!chatChannelId) return notFound()

        const accessToken = await fetch(
            `https://comm-api.game.naver.com/nng_main/v1/chats/access-token?channelId=${chatChannelId}&chatType=STREAMING`,
            {signal}
        ).then(r => r.json()).then(data => data['content']['accessToken'])

        props.chzzk = {
            chatChannelId,
            accessToken
        }
    }

    if (overlay.user.twitch && config.showTwitch) {
        const id = overlay.user.twitch
        const login = await getTwitchUserById(id).then(user => user.name)
        const badges = {...await getTwitchGlobalBadges(), ...await getTwitchChannelBadges(id)}
        props.twitch = {login: login, badges}
    }

    return (
        <ChatBox {...props}/>
    )
}