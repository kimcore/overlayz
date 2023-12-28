"use client"

import NextLink from "next/link"
import {Button} from "@nextui-org/react"
import {FiLogOut} from "react-icons/fi"
import {FaDiscord, FaGithub, FaLayerGroup, FaLink} from "react-icons/fa"
import {usePathname} from "next/navigation"
import {MdEmail} from "react-icons/md"

export default function Sidebar() {
    function logout() {
        fetch("/auth/logout", {
            method: "POST"
        }).then(r => r.ok && window.location.reload())
    }

    const pathname = usePathname()

    return (
        <div className="flex flex-col fixed w-72 h-full p-4 bg-[#191919]">
            <div className="flex justify-between">
                <NextLink href="/" className="flex items-end">
                    <h1 className="text-2xl font-bold text-gradient">
                        OVERLAY
                    </h1>
                    <img src="/assets/z.svg" className="size-8"/>
                </NextLink>
                <Button className="rounded-xl text-red-500" size="sm"
                        onClick={logout} variant="flat" startContent={<FiLogOut/>}>
                    로그아웃
                </Button>
            </div>
            <div className="flex flex-col mt-8 gap-4">
                <Button as={NextLink} href="/overlay"
                        className="h-16 text-2xl font-bold justify-start"
                        variant={pathname.startsWith("/overlay") ? "flat" : "light"}
                        startContent={<FaLayerGroup className="mx-4"/>}>
                    오버레이
                </Button>
                <Button as={NextLink} href="/connect"
                        className="h-16 text-2xl font-bold justify-start"
                        variant={pathname.startsWith("/connect") ? "flat" : "light"}
                        startContent={<FaLink className="mx-4"/>}>
                    채널 연결
                </Button>
            </div>
            <div className="flex-1"/>
            <div className="flex flex-col gap-4 text-sm text-gray-400 [&_a]:transition-colors [&_a]:text-white">
                <div>
                    <div className="flex items-center gap-1">
                        <FaDiscord/>
                        디스코드:
                        <a href="https://discord.com/users/339997635677257740" target="_blank"
                           className="hover:text-[#B5E3FD]">
                            kimcore
                        </a>
                    </div>
                    <div className="flex items-center gap-1">
                        <MdEmail/>
                        이메일:
                        <a href="mailto:me@kimcore.dev" target="_blank" className="hover:text-[#B5E3FD]">
                            me@kimcore.dev
                        </a>
                    </div>
                    <div className="flex items-center gap-1">
                        <FaGithub/>
                        GitHub:
                        <a href="https://github.com/kimcore/overlayz" target="_blank"
                           className="hover:text-[#B5E3FD]">
                            kimcore/overlayz
                        </a>
                    </div>
                </div>
                <h4 className="text-xs text-gray-400">
                    OVERLAYZ는 치지직 및 Twitch의 서드파티 사이트로 치지직 및 Twitch에서 운영하는 사이트가 아닙니다.
                    'CHZZK' 및 '치지직'은 네이버 주식회사의 등록상표이며 'Twitch' 및 '트위치'는 Twitch Interactive, Inc.의 등록상표입니다.
                </h4>
                <div>
                    @ 2023{` `}
                    <a href="https://kimcore.dev" target="_blank" className="hover:text-[#B5E3FD]">
                        kimcore
                    </a>
                    .
                </div>
            </div>
        </div>
    )
}