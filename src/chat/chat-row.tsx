import React, {memo} from "react"
import {ChatBoxConfig} from "@/app/o/config"
import {Chat} from "@/chat/types"

function ChatRow({chat, config}: { chat: Chat, config: ChatBoxConfig }) {
    const {nickname, badges, color, message, platform} = chat

    return (
        <div data-from={nickname} className={platform} style={{"--color": color} as React.CSSProperties}>
            <span className="meta" style={{color}}>
                {config.showBadge && badges.map((badge, i) => <img key={i} alt="" className="badge" src={badge}/>)}
                {config.showPlatform && <img className="badge" alt="" src={`/assets/${platform}.svg`}/>}
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