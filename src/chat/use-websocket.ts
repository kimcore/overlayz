import {useEffect, useRef, useState} from "react"

export interface UseWebSocketOptions {
    url: string
    onMessage: (ws: WebSocket, event: MessageEvent) => void
    onOpen?: (ws: WebSocket, event: Event) => void
    onClose?: (ws: WebSocket) => void
}

export default function useWebSocket({url, onMessage, onOpen, onClose}: UseWebSocketOptions) {
    const isBrowserUnloadingRef = useRef<boolean>(false)
    const [webSocketBuster, setWebSocketBuster] = useState<number>(0)

    useEffect(() => {
        const ws = new WebSocket(url)

        ws.onopen = event => onOpen?.(ws, event)
        ws.onmessage = event => onMessage(ws, event)
        ws.onclose = event => {
            if (!isBrowserUnloadingRef.current) {
                setTimeout(() => setWebSocketBuster(new Date().getTime()), 1000)
            }
        }

        return () => {
            onClose?.(ws)
            ws.close()
        }
    }, [webSocketBuster])

    useEffect(() => {
        const beforeUnload = () => {
            isBrowserUnloadingRef.current = true
        }

        window.addEventListener("beforeunload", beforeUnload)
    }, [])
}