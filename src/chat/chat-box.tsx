"use client"

import {useCallback, useEffect, useState} from "react"
import {buildCss, ChatBoxConfig} from "@/app/o/config"
import ChatRow from "@/chat/chat-row"
import useChatList from "@/chat/use-chat"

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

    const chatList = useChatList(props)

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