import {JSX} from "react"

export interface Chat {
    uid: string
    time: number
    nickname: string
    badges: string[]
    color: string
    message: JSX.Element | string
    platform: string
}
