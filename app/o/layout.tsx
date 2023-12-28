import "@/fonts/webfont.css"
import "animate.css/animate.css"
import {Metadata} from "next"

export const metadata: Metadata = {
    title: "OVERLAYZ"
}

export default function RootLayout({children}) {
    return (
        <html lang="ko">
        <body>
        {children}
        </body>
        </html>
    )
}
