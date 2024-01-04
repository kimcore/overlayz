import ChatBox, {ChatBoxProps} from "@/chat/chat-box"
import {ChatBoxConfig} from "@/app/o/config"
import {notFound} from "next/navigation"
import {getTwitchChannelBadges, getTwitchGlobalBadges, getTwitchUserById} from "@/utils/twitch"
import prisma from "@/database/prisma"
import {chzzk, retrieveChzzkAccessToken} from "@/utils/chzzk"
import "../chat.css"

export const dynamic = "force-dynamic"

export default async function ChatPage({params: {overlayId}}) {
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

        const liveStatus = await chzzk.live.status(channelId).catch(() => null)
        const isLive = liveStatus?.status == "OPEN"
        const chatChannelId = liveStatus?.chatChannelId

        if (!chatChannelId) return notFound()

        const accessToken = await retrieveChzzkAccessToken(chatChannelId)

        props.chzzk = {
            isLive,
            channelId,
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