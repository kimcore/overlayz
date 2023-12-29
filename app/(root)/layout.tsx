import {Providers} from "@/app/(root)/providers"
import "./globals.css"
import {getSession} from "@/auth/lucia"
import {Login} from "@/app/(root)/login"
import {Metadata} from "next"

export const metadata: Metadata = {
    metadataBase: new URL("https://overlayz.kr"),
    title: "OVERLAYZ",
    description: "다중송출 스트리머를 위한 통합 오버레이",
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: "https://overlayz.kr",
        title: "OVERLAYZ",
        description: "다중송출 스트리머를 위한 통합 오버레이",
        siteName: "OVERLAYZ",
        images: [
            {
                url: "/assets/z.png",
                width: 512,
                height: 512,
                alt: "OVERLAYZ"
            },
        ]
    }
}
export default async function Layout({children}) {
    const {session} = await getSession()

    return (
        <html lang="ko" suppressHydrationWarning>
        <head>
            <link rel="stylesheet" as="style"
                  href="https://cdnjs.cloudflare.com/ajax/libs/pretendard/1.3.9/variable/pretendardvariable-dynamic-subset.min.css"/>
        </head>
        <body>
        <Providers>
            {session ? children : <Login/>}
        </Providers>
        </body>
        </html>
    )
}
