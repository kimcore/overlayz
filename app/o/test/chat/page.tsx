"use client"

import {useLocalstorageState} from "rooks"
import ChatBox from "@/app/o/chat-box"
import {ChatBoxConfig} from "@/app/o/config"

export default function ChatTestPage() {
    const [config] = useLocalstorageState<ChatBoxConfig>("chat-config")

    return (
        <ChatBox test config={config}/>
    )
}