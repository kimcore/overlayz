"use client"

import {Fragment, useCallback, useEffect, useRef, useState} from "react"
import {ChatCmd, ChatExtras, Profile} from "chzzk"
import {buildCss, ChatBoxConfig} from "@/app/o/config"
import ChatRow, {Chat} from "@/app/o/chat-row"
import {platformNames} from "@/utils/platforms"

const colors = ["#ECA843", "#EEA05D", "#EA723D", "#EAA35F", "#E98158", "#E97F58", "#E76D53", "#E66D5F", "#E56B79", "#E16490", "#E481AE", "#E68199", "#DC5E9A", "#E16CB5", "#D25FAC", "#D263AE", "#D66CB4", "#D071B6", "#BA82BE", "#AF71B5", "#A96BB2", "#905FAA", "#B38BC2", "#9D78B8", "#8D7AB8", "#7F68AE", "#9F99C8", "#717DC6", "#5E7DCC", "#5A90C0", "#628DCC", "#7994D0", "#81A1CA", "#ADD2DE", "#80BDD3", "#83C5D6", "#8BC8CB", "#91CBC6", "#83C3BB", "#7DBFB2", "#AAD6C2", "#84C194", "#B3DBB4", "#92C896", "#94C994", "#9FCE8E", "#A6D293", "#ABD373", "#BFDE73", "#CCE57D"]

const testChats = [
    {
        nickname: "코어",
        badges: ["https://static-cdn.jtvnw.net/badges/v1/ca980da1-3639-48a6-95a3-a03b002eb0e5/1"],
        color: "#B5E3FD",
        message: "안녕하세요! OVERLAYZ를 사용해주셔서 감사합니다",
        platform: "twitch"
    },
    {
        nickname: "OVERLAYZ",
        badges: ["https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1"],
        message: "아래에서 설정을 원하는 대로 바꿔보세요",
        platform: "twitch"
    },
    {
        nickname: "오늘의 꿀팁",
        badges: ["https://ssl.pstatic.net/static/nng/glive/icon/fan.png"],
        message: "기존에 사용하시던 CSS를 그대로 사용하실 수 있어요",
        platform: "chzzk"
    },
    {
        nickname: "무빙맨",
        message: "문의나 건의사항이 있으시다면?"
    },
    {
        nickname: "닉네임뭘로하지",
        message: "왼쪽 메뉴 하단 디스코드로 연락주세요!"
    }
]

function colorFromString(seed: string) {
    const index = seed.split("")
        .map((c: string) => c.charCodeAt(0))
        .reduce((a: number, b: number) => a + b, 0) % colors.length
    return colors[index]
}

function randomUID() {
    return Math.random().toString(36).substring(2, 12)
}

export type ChatBoxProps = {
    chzzk?: {
        chatChannelId: string
        accessToken: string
    },
    twitch?: {
        login: string
        badges: Record<string, string>
    },
    test?: boolean
    config: ChatBoxConfig
}

export default function ChatBox(props: ChatBoxProps) {
    const [config, setConfig] = useState(props.config)
    const {chzzk, twitch, test} = props

    const isBrowserUnloadingRef = useRef<boolean>(false)
    const lastSetTimestampRef = useRef<number>(0)
    const pendingChatListRef = useRef<Chat[]>([])
    const [chatList, setChatList] = useState<Chat[]>([])
    const [webSocketBuster, setWebSocketBuster] = useState<number>(0)

    const defaults = {
        cid: chzzk?.chatChannelId,
        svcid: "game",
        ver: "2"
    }

    function appendChat(chat: Chat) {
        appendChats([chat])
    }

    function appendChats(chats: Chat[]) {
        pendingChatListRef.current = [...pendingChatListRef.current, ...chats].filter(
            ({time}, i) => i < 50 || new Date().getTime() - time < 1000
        )

        window.scrollTo(0, document.body.scrollHeight)
    }

    function buildChatFromChzzk(chat: any) {
        if ((chat['msgStatusType'] || chat['messageStatusType']) == "HIDDEN") return

        const profile: Profile = JSON.parse(chat['profile'])
        const extras: ChatExtras = JSON.parse(chat['extras'])

        const content = chat['msg'] || chat['content'] || ''

        const time = chat['msgTime'] || chat['messageTime']

        const id = profile.userIdHash
        const nickname = profile.nickname
        const badge = profile.badge?.imageUrl
        const donationBadge = profile.streamingProperty?.realTimeDonationRanking?.badge?.imageUrl
        const badges = [badge, donationBadge].concat(
            profile.activityBadges?.filter(badge => badge.activated)?.map(badge => badge.imageUrl) ?? []
        ).filter(badge => badge != null)
        const color = profile.title?.color ?? colorFromString(profile.userIdHash + chzzk.chatChannelId)
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
            uuid: randomUID(),
            time,
            id,
            nickname,
            badges,
            color,
            message,
            platform: "chzzk"
        }
    }

    async function onChzzkMessage(event: MessageEvent) {
        const json = JSON.parse(event.data)

        switch (json.cmd) {
            case ChatCmd.PING:
                this.send(JSON.stringify({
                    ver: "2",
                    cmd: ChatCmd.PONG
                }))
                break
            case ChatCmd.CONNECTED:
                if (config.showRecentChat) {
                    const sid = json.bdy.sid
                    this.send(JSON.stringify({
                        bdy: {recentMessageCount: 50},
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
                const chats = (isRecent ? json['bdy']['messageList'] : json['bdy'])
                    .filter((chat: any) =>
                        (chat['msgTypeCode'] || chat['messageTypeCode']) == 1 &&
                        (chat['msgStatusType'] || chat['messageStatusType']) != "HIDDEN"
                    )
                    .map(buildChatFromChzzk)

                if (isRecent) {
                    setChatList(chats)
                } else {
                    chats.forEach(appendChat)
                }

                break
        }

        if (json.cmd !== ChatCmd.PONG) {
            this.worker.postMessage("startPingTimer")
        }
    }

    const connectChzzk = useCallback(() => {
        const server = Math.floor(Math.random() * 10) + 1
        const ws = new WebSocket(`wss://kr-ss${server}.chat.naver.com/chat`)

        const worker = new Worker(
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

        ws.onopen = () => {
            ws.send(JSON.stringify({
                bdy: {
                    accTkn: chzzk.accessToken,
                    auth: "READ",
                    devType: 2001,
                    uid: null
                },
                cmd: ChatCmd.CONNECT,
                tid: 1,
                ...defaults
            }))
        }

        ws.onclose = () => {
            if (!isBrowserUnloadingRef.current) {
                setTimeout(() => setWebSocketBuster(new Date().getTime()), 1000)
            }
        }

        ws['worker'] = worker

        ws.onmessage = onChzzkMessage

        worker.postMessage("startPingTimer")

        return () => {
            worker.postMessage("stop")
            worker.terminate()
            ws.close()
        }
    }, [chzzk])

    async function onTwitchMessage(event: MessageEvent) {
        const data = event.data

        if (!data.includes("PRIVMSG")) return

        const [tags, chatMessage] = data.replace("\r\n", "").split(`PRIVMSG #${twitch.login} :`)

        const time = Date.now()

        const id = tags.split("user-id=")[1].split(";")[0]
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
                        parts.push(chatMessage.substring(lastEnd, emote.start))
                    }
                    parts.push(
                        <span key={`${start}-${i}`} className="emote_wrap">
                            <img className="emoticon" alt={chatMessage.substring(emote.start, emote.end + 1)}
                                 src={`https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/4.0`}/>
                        </span>
                    )
                    lastEnd = emote.end + 1
                })
            })

            if (lastEnd < chatMessage.length) {
                parts.push(chatMessage.substring(lastEnd))
            }

            return parts
        }

        const message = (
            <span className="message">
                {emotes.length > 0 ? renderEmotes() : chatMessage}
            </span>
        )

        appendChat({
            uid: randomUID(),
            time,
            id,
            nickname,
            badges,
            color,
            message,
            platform: "twitch"
        })
    }

    const connectTwitch = useCallback(() => {
        const ws = new WebSocket(`wss://irc-ws.chat.twitch.tv:443`)

        ws.onopen = () => {
            const justinfan = "justinfan" + Math.floor(Math.random() * 100000)
            ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership")
            ws.send("PASS SCHMOOPIIE")
            ws.send(`NICK ${justinfan}`)
            ws.send(`USER ${justinfan} 8 * :${justinfan}`)
            ws.send(`JOIN #${twitch.login}`)
        }

        ws.onclose = () => {
            if (!isBrowserUnloadingRef.current) {
                setTimeout(() => setWebSocketBuster(new Date().getTime()), 1000)
            }
        }

        ws.onmessage = onTwitchMessage

        return () => ws.close()
    }, [twitch])

    function onTestChat(index: number) {
        const chat = testChats[index]
        const id = randomUID()
        const time = Date.now()

        const platforms = Object.keys(platformNames)

        appendChat({
            ...chat,
            id,
            time,
            uid:
            id,
            badges: chat.badges ?? [],
            color: chat.color ?? colors[Math.floor((Math.random() * colors.length))],
            platform: chat.platform ?? platforms[Math.floor((Math.random() * platforms.length))]
        })
    }

    const handleObsStreamingStarted = useCallback(() => {
        window.location.reload()
    }, [])

    // requires obs 30.0.1+
    useEffect(() => {
        window.addEventListener("obsStreamingStarted", handleObsStreamingStarted)
        return () => {
            window.removeEventListener("obsStreamingStarted", handleObsStreamingStarted)
        }
    }, [handleObsStreamingStarted])

    useEffect(() => {
        const noop = () => {}

        const closeChzzk = chzzk ? connectChzzk() : noop
        const closeTwitch = twitch ? connectTwitch() : noop

        return () => {
            closeChzzk()
            closeTwitch()
        }
    }, [connectChzzk, connectTwitch, webSocketBuster])

    useEffect(() => {
        const maxChatLength = 50

        const interval = setInterval(() => {
            if (document.hidden) {
                return
            }
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

        let testMessageIndex = 0
        const testInterval = test ? setInterval(() => {
            onTestChat(testMessageIndex)
            testMessageIndex = (testMessageIndex + 1) % testChats.length
        }, 2500) : null

        window.addEventListener("beforeunload", () => isBrowserUnloadingRef.current = true)

        return () => {
            clearInterval(interval)
            clearInterval(testInterval)
            lastSetTimestampRef.current = 0
        }
    }, [])

    useEffect(() => {
        setConfig(props.config)
    }, [props.config])

    useEffect(() => {
        document.getElementById("chatbox_style")?.remove()

        const style = document.createElement("style")
        style.id = "chatbox_style"
        style.innerHTML = buildCss(config)

        document.head.appendChild(style)
    }, [config])

    return (
        <div id="log">
            {chatList.map((chat) => (
                <ChatRow key={chat.uid} config={config} chat={chat}/>
            ))}
        </div>
    )
}