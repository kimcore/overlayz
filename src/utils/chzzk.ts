import {ChzzkClient} from "chzzk"

export const chzzk = new ChzzkClient()

export async function retrieveChzzkAccessToken(chatChannelId: string) {
    const {signal} = new AbortController()

    return await fetch(
        `https://comm-api.game.naver.com/nng_main/v1/chats/access-token?channelId=${chatChannelId}&chatType=STREAMING`,
        {signal}
    ).then(r => r.json()).then(data => data?.['content']?.['accessToken']).catch(() => null)
}