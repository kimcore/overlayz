import React, {JSX, memo} from "react"
import {ChatBoxConfig} from "@/app/o/config"

export interface Chat {
    uid: string
    time: number
    id: string
    nickname: string
    badges: string[]
    color: string
    message: JSX.Element | string
    platform: string
}

function ChatRow({chat, config}: { chat: Chat, config: ChatBoxConfig }) {
    const {id, nickname, badges, color, message, platform } = chat

    return (
        <div data-from={id} style={{"--color": color} as React.CSSProperties}>
            <span className="meta" style={{color}}>
                {config.showBadge && badges.map((badge, i) => <img key={i} className="badge" src={badge}/>)}
                {config.showPlatform && <img className="badge" src={`/assets/${platform}.svg`}/>}
                {config.showName && <span className="name">{nickname}</span>}
                {config.showColon && <span className="colon">:</span>}
            </span>
            <span className="message">
                {message}
            </span>
        </div>
    )
}

export default memo(ChatRow)