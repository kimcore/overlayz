"use server"

import {chzzk, retrieveChzzkAccessToken} from "@/utils/chzzk"

export async function checkAccessToken(channelId: string) {
    const liveStatus = await chzzk.live.status(channelId)
    if (!liveStatus || liveStatus.status == "CLOSE") return null

    return retrieveChzzkAccessToken(liveStatus.chatChannelId)
}