"use server"

import {auth, getSession} from "@/auth/lucia"
import {channelUrlRegex} from "@/utils/platforms"
import {twitch} from "@/utils/twitch"
import {ChzzkClient} from "chzzk"

export async function unlinkPlatform(platform: string) {
    const {session: {user}} = await getSession()

    const attributes = {}

    switch (platform) {
        case "twitch":
            attributes["twitch"] = null
            break
        case "chzzk":
            attributes["chzzk"] = null
            break
    }

    await auth.updateUserAttributes(user.id, attributes)
}

export async function linkPlatform(platform: string, value: string) {
    try {
        const {session: {user}} = await getSession()

        const attributes = {}

        const regex = channelUrlRegex[platform]

        const match = value.match(regex)

        if (!match) return "잘못된 URL입니다."

        switch (platform) {
            case "twitch":
                const user = await twitch.users.getUserByName(match[1])
                if (!user) return "잘못된 트위치 채널 URL입니다."
                attributes["twitch"] = user.id
                break
            case "chzzk":
                const client = new ChzzkClient()
                const channel = await client.channel(match[1])
                if (!channel) return "잘못된 치지직 채널 URL입니다."
                attributes["chzzk"] = channel.channelId
                break
            default:
                return "잘못된 요청입니다."
        }

        await auth.updateUserAttributes(user.id, attributes)

        return null
    } catch (e) {
        console.error(e)
        return "알 수 없는 오류가 발생했습니다."
    }
}