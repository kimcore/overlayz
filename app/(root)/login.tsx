import {Button} from "@nextui-org/react"
import {FaTwitch} from "react-icons/fa"

export function Login() {
    return (
        <div className="flex flex-col justify-center md:flex-row h-screen">
            <div className="flex flex-col w-full justify-center items-center gap-8 py-16 px-8">
                <h1 className="text-xl text-gray-400">
                    다중송출 스트리머를 위한 통합 오버레이
                </h1>
                <div className="flex">
                    <h1 className="text-5xl font-bold text-gradient">
                        OVERLAY
                    </h1>
                    <img src="/assets/z.svg" className="size-16"/>
                </div>
                <div className="flex items-center gap-4">
                    <img className="size-16" src="/assets/chzzk.svg"/>
                    <img className="size-16" src="/assets/twitch.svg"/>
                </div>
                <h4 className="text-gray-500">
                    아프리카TV 지원 예정
                </h4>
            </div>
            <div className="flex flex-col w-full justify-center items-center gap-6">
                <Button as="a" href="/auth/login/twitch" className="w-64 bg-[#9146FF]"
                        size="lg" startContent={<FaTwitch fontSize="1.5em"/>}>
                    트위치 로그인
                </Button>
                <h4 className="text-gray-500">
                    현재는 트위치 로그인만 지원됩니다.<br/><br/>
                    사용자 인증을 위해 로그인만 트위치를 통해 진행되는 것이고,<br/>
                    채팅창 연동은 치지직/트위치 채널 URL만 있으면 가능합니다.
                </h4>
            </div>
        </div>
    )
}