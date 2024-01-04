import {Fragment, useCallback, useEffect, useRef, useState} from "react"
import {nicknameColors, testChats} from "./constants"
import {Chat} from "./types"
import {ChatCmd, ChatExtras, Profile} from "chzzk"
import {ChatBoxProps} from "@/chat/chat-box"
import {platformNames} from "@/utils/platforms"
import useWebSocket from "@/chat/use-websocket"
import {checkAccessToken} from "@/app/o/actions"

function colorFromString(seed: string) {
    const index = seed.split("")
        .map((c: string) => c.charCodeAt(0))
        .reduce((a: number, b: number) => a + b, 0) % nicknameColors.length
    return nicknameColors[index]
}

function randomUID() {
    return Math.random().toString(36).substring(2, 12)
}

export default function useChatList(props: ChatBoxProps, maxChatLength: number = 50) {
    const {chzzk, twitch, test, config} = props

    const lastSetTimestampRef = useRef<number>(0)
    const pendingChatListRef = useRef<Chat[]>([])
    const [chatList, setChatList] = useState<Chat[]>([])
    const [chzzkAccessToken, setChzzkAccessToken] = useState<string>(chzzk?.accessToken ?? null)

    function appendChats(chats: Chat[]) {
        pendingChatListRef.current = [...pendingChatListRef.current, ...chats].slice(-1 * maxChatLength)
    }

    const convertChzzkChat = useCallback((raw: any): Chat => {
        const profile: Profile = JSON.parse(raw['profile'])
        const extras: ChatExtras = JSON.parse(raw['extras'])

        const content = raw['msg'] || raw['content'] || ''

        const time = raw['msgTime'] || raw['messageTime']

        const nickname = profile.nickname
        const badge = profile.badge?.imageUrl
        const donationBadge = profile.streamingProperty?.realTimeDonationRanking?.badge?.imageUrl
        const badges = [badge, donationBadge].concat(
            profile.activityBadges?.filter(badge => badge.activated)?.map(badge => badge.imageUrl) ?? []
        ).filter(badge => badge != null)
        const channelId = raw["cid"] || raw["channelId"]
        const color = profile.title?.color ?? colorFromString((profile.userIdHash + channelId))
        const emojis = extras?.emojis ?? null

        const message = (
            <span className="message">
                {emojis ? content.split(
                    new RegExp(`\{:(${Object.keys(emojis).join("|")}):}`, "g")
                ).map((part: string, i: number) => (
                    <Fragment key={i}>
                        {i % 2 == 0 ? part : <span className="emote_wrap">
                            <img className="emoticon" alt={`{:${part}:}`} src={emojis[part]}/>
                        </span>}
                    </Fragment>
                )) : content}
            </span>
        )

        return {
            uid: randomUID(),
            time,
            nickname,
            badges,
            color,
            message,
            platform: "chzzk"
        }
    }, [])

    const convertTwitchChat = useCallback((tags: string, content: string): Chat => {
        const time = Date.now()

        const nickname = tags.split("display-name=")[1].split(";")[0]
        const badges = tags.split("badges=")[1].split(";")[0].split(",")
            .filter((badge: string) => badge.length > 0)
            .map((badge: string) => twitch.badges[badge])
        const color = tags.split("color=")[1].split(";")[0] || colorFromString(nickname + twitch.login)
        const emotes = tags.split("emotes=")[1].split(";")[0].split("/").filter((emote: string) => emote.length > 0)

        function renderEmotes() {
            const parts = []
            const emoteOccurrences = new Map()

            emotes.forEach((emoteString: string) => {
                const [id, positions] = emoteString.split(":")
                const ranges = positions.split(",")

                ranges.forEach((range) => {
                    const [start, end] = range.split("-")
                    const emote = {
                        id,
                        start: parseInt(start),
                        end: parseInt(end)
                    }

                    if (emoteOccurrences.has(emote.start)) {
                        emoteOccurrences.get(emote.start).push(emote)
                    } else {
                        emoteOccurrences.set(emote.start, [emote])
                    }
                })
            })

            const sortedOccurrences = Array.from(emoteOccurrences.entries()).sort((a, b) => a[0] - b[0])

            let lastEnd = 0
            sortedOccurrences.forEach(([start, emoteArray]) => {
                emoteArray.forEach((emote: { id: string, start: number, end: number }, i: number) => {
                    if (emote.start > lastEnd) {
                        parts.push(content.substring(lastEnd, emote.start))
                    }
                    parts.push(
                        <span key={`${start}-${i}`} className="emote_wrap">
                            <img className="emoticon" alt={content.substring(emote.start, emote.end + 1)}
                                 src={`https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/4.0`}/>
                        </span>
                    )
                    lastEnd = emote.end + 1
                })
            })

            if (lastEnd < content.length) {
                parts.push(content.substring(lastEnd))
            }

            return parts
        }

        const message = (
            <span className="message">
                {emotes.length > 0 ? renderEmotes() : content}
            </span>
        )

        return {
            uid: randomUID(),
            time,
            nickname,
            badges,
            color,
            message,
            platform: "twitch"
        }
    }, [])

    function onTestChat(index: number) {
        const chat = testChats[index]
        const id = randomUID()
        const time = Date.now()

        const platforms = Object.keys(platformNames)

        appendChats([{
            ...chat,
            time,
            uid:
            id,
            badges: chat.badges ?? [],
            color: chat.color ?? nicknameColors[Math.floor((Math.random() * nicknameColors.length))],
            platform: chat.platform ?? platforms[Math.floor((Math.random() * platforms.length))]
        }])
    }

    if (chzzk) {
        if (!chzzk.isLive) {
            useEffect(() => {
                let interval = null

                interval = setInterval(() => {
                    checkAccessToken(chzzk.channelId).then(accessToken => {
                        if (accessToken != null) {
                            clearInterval(interval)
                            setChzzkAccessToken(accessToken)
                        }
                    })
                }, 5000)

                return () => {
                    clearInterval(interval)
                }
            }, [])
        }

        const defaults = {
            cid: chzzk.chatChannelId,
            svcid: "game",
            ver: "2"
        }

        let worker = null

        useWebSocket({
            url: "wss://kr-ss1.chat.naver.com/chat",
            onOpen: (ws) => {
                worker = new Worker(
                    URL.createObjectURL(new Blob([`
                        let timeout = null

                        onmessage = (e) => {
                            if (e.data === "startPingTimer") {
                                if (timeout != null) {
                                    clearTimeout(timeout)
                                }
                                timeout = setTimeout(function reservePing() {
                                    postMessage("ping")
                                    timeout = setTimeout(reservePing, 20000)
                                }, 20000)
                            }
                            if (e.data === "stop") {
                                if (timeout != null) {
                                    clearTimeout(timeout)
                                }
                            }
                        }
                    `], {type: "application/javascript"}))
                )

                worker.onmessage = (e) => {
                    if (e.data === "ping") {
                        ws.send(JSON.stringify({
                            ver: "2",
                            cmd: ChatCmd.PING
                        }))
                    }
                }

                ws.send(JSON.stringify({
                    bdy: {
                        accTkn: chzzkAccessToken,
                        auth: "READ",
                        devType: 2001,
                        uid: null
                    },
                    cmd: ChatCmd.CONNECT,
                    tid: 1,
                    ...defaults
                }))
            },
            onMessage: (ws, event) => {
                const json = JSON.parse(event.data)

                switch (json.cmd) {
                    case ChatCmd.PING:
                        ws.send(JSON.stringify({
                            ver: "2",
                            cmd: ChatCmd.PONG,
                        }))
                        break
                    case ChatCmd.CONNECTED:
                        if (config.showRecentChat) {
                            const sid = json.bdy.sid
                            ws.send(JSON.stringify({
                                bdy: {recentMessageCount: maxChatLength},
                                cmd: ChatCmd.REQUEST_RECENT_CHAT,
                                sid,
                                tid: 2,
                                ...defaults
                            }))
                        }
                        break
                    case ChatCmd.RECENT_CHAT:
                    case ChatCmd.CHAT:
                        const isRecent = json.cmd == ChatCmd.RECENT_CHAT
                        const chats: Chat[] = (isRecent ? json['bdy']['messageList'] : json['bdy'])
                            .filter((chat: any) => (chat['msgTypeCode'] || chat['messageTypeCode']) == 1)
                            .filter((chat: any) => !((chat['msgStatusType'] || chat['messageStatusType']) == "HIDDEN"))
                            .map(convertChzzkChat)

                        if (isRecent) {
                            pendingChatListRef.current = []
                            setChatList(chats)
                        } else {
                            appendChats(chats)
                        }
                        break
                }

                if (json.cmd !== ChatCmd.PONG) {
                    worker.postMessage("startPingTimer")
                }
            },
            onClose: () => {
                worker?.postMessage("stop")
                worker?.terminate()
            },
            reconnectKeys: [chzzkAccessToken]
        })
    }

    if (twitch) {
        useWebSocket({
            url: `wss://irc-ws.chat.twitch.tv`,
            onOpen: (ws) => {
                const justinfan = "justinfan" + Math.floor(Math.random() * 100000)
                ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership")
                ws.send("PASS SCHMOOPIIE")
                ws.send(`NICK ${justinfan}`)
                ws.send(`USER ${justinfan} 8 * :${justinfan}`)
                ws.send(`JOIN #${twitch.login}`)
            },
            onMessage: (ws, event) => {
                const data = event.data

                if (data == "PING :tmi.twitch.tv") {
                    ws.send("PONG :tmi.twitch.tv")
                    return
                }

                if (!data.includes("PRIVMSG")) return

                const [tags, chatMessage] = data.replace("\r\n", "").split(`PRIVMSG #${twitch.login} :`)

                const chat = convertTwitchChat(tags, chatMessage)

                appendChats([chat])
            }
        })
    }

    useEffect(() => {
        let testMessageIndex = 0
        const testInterval = test ? setInterval(() => {
            onTestChat(testMessageIndex)
            testMessageIndex = (testMessageIndex + 1) % testChats.length
        }, 2500) : null

        const interval = setInterval(() => {
            if (document.hidden) return

            if (pendingChatListRef.current.length > 0) {
                if (new Date().getTime() - lastSetTimestampRef.current > 1000) {
                    setChatList((prevChatList) => {
                        const newChatList = [...prevChatList, ...pendingChatListRef.current].slice(-1 * maxChatLength)
                        pendingChatListRef.current = []
                        return newChatList
                    })
                } else {
                    setChatList((prevChatList) => {
                        const newChatList = [...prevChatList, pendingChatListRef.current.shift()]
                        if (newChatList.length > maxChatLength) {
                            newChatList.shift()
                        }
                        return newChatList
                    })
                }
            }

            lastSetTimestampRef.current = new Date().getTime()
        }, 75)

        return () => {
            clearInterval(interval)
            clearInterval(testInterval)

            lastSetTimestampRef.current = 0
        }
    }, [])

    return chatList
}
