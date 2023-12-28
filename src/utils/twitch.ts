import {ApiClient} from "@twurple/api"
import {AppTokenAuthProvider} from "@twurple/auth"

const authProvider = new AppTokenAuthProvider(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET)

export let twitch: ApiClient

if (process.env.NODE_ENV === 'production') {
    twitch = new ApiClient({authProvider})
} else {
    if (!global.twitch) {
        global.twitch = new ApiClient({authProvider})
    }
    twitch = global.twitch
}

export const getTwitchUserById = async (userId: string) => {
    return await twitch.users.getUserById(userId)
}

export const getTwitchGlobalBadges = async () => {
    const badges = await twitch.chat.getGlobalBadges()
    return Object.fromEntries(badges.flatMap(badge =>
        badge.versions.map(version =>
            ([`${badge.id}/${version.id}`, version.getImageUrl(4)])
        )
    )) as Record<string, string>
}

export const getTwitchChannelBadges = async (userId: string) => {
    const badges = await twitch.chat.getChannelBadges(userId)
    return Object.fromEntries(badges.flatMap(badge =>
        badge.versions.map(version =>
            ([`${badge.id}/${version.id}`, version.getImageUrl(4)])
        )
    )) as Record<string, string>
}

