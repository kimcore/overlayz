import {getSession} from "@/auth/lucia"
import {getTwitchUserById} from "@/utils/twitch"
import Platform from "./platform"
import {ChzzkClient} from "chzzk"

export default async function Connect() {
    const {session: {user}} = await getSession()

    const twitchUser = user.twitch ? await getTwitchUserById(user.twitch).then(user => ({
        name: user.displayName,
        image: user.profilePictureUrl,
        url: `https://twitch.tv/${user.name}`
    })) : null

    const chzzkClient = new ChzzkClient()

    const chzzkUser = user.chzzk ? await chzzkClient.channel(user.chzzk).then(channel => channel ? ({
        name: channel.channelName,
        image: channel.channelImageUrl,
        url: `https://chzzk.naver.com/${channel.channelId}`
    }) : null) : null

    return (
        <div className="flex justify-center gap-4 py-16">
            <div className="grid grid-cols-2 gap-6">
                <Platform platform="chzzk" user={chzzkUser}/>
                <Platform platform="twitch" user={twitchUser}/>
            </div>
        </div>
    )
}