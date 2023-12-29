"use client"

import {Avatar, Button, Card, CardBody, Input} from "@nextui-org/react"
import {linkPlatform, unlinkPlatform} from "./actions"
import {FaLinkSlash} from "react-icons/fa6"
import {FaLink} from "react-icons/fa"
import {useRouter} from "next/navigation"
import {useRef} from "react"
import {channelUrlRegex, platformNames} from "@/utils/platforms"
import {toast} from "sonner"

export default function Platform({user, platform}) {
    const {refresh} = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)

    function checkAndLink() {
        const url = inputRef.current.value.trim()

        const regex = channelUrlRegex[platform]

        if (!regex.test(url)) {
            return toast.error("잘못된 URL입니다.")
        }

        linkPlatform(platform, url).then(error => {
            if (error) {
                toast.error(error)
            } else {
                toast.success(`${platformNames[platform]} 채널이 연결되었습니다.`)
                refresh()
            }
        })
    }

    return (
        <Card className="w-64">
            <CardBody className="justify-between p-8 gap-4">
                <div className="flex items-center">
                    <img src={`/assets/${platform}.svg`} className="size-8"/>
                    <h1 className="text-xl font-bold ml-4">
                        {platformNames[platform]}
                    </h1>
                </div>
                {user ? (
                    <div className="flex flex-col gap-2">
                        <a href={user.url} target="_blank"
                           className="flex items-center gap-4 p-2 bg-whitealpha-100 rounded-xl">
                            <Avatar src={user.image}/>
                            <h1 className="text-lg font-bold">
                                {user.name}
                            </h1>
                        </a>
                        <Button variant="flat" color="danger" className="w-full"
                                onClick={() => unlinkPlatform(platform).then(refresh)}
                                startContent={<FaLinkSlash/>}>
                            연결 해제
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <Input ref={inputRef} placeholder="채널 URL" labelPlacement="outside"/>
                        <Button variant="flat" className="w-full"
                                onClick={checkAndLink} startContent={<FaLink/>}>
                            연결하기
                        </Button>
                    </div>
                )}
            </CardBody>
        </Card>
    )
}