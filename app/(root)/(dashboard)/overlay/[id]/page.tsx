import {getSession} from "@/auth/lucia"
import prisma from "@/database/prisma"
import {notFound} from "next/navigation"
import {ChatBoxConfig} from "@/app/(root)/(dashboard)/overlay/[id]/config"
import "@/fonts/webfont.css"

export const dynamic = "force-dynamic"

export default async function OverlayPage({params: {id}}) {
    const {session: {user}} = await getSession()
    const overlay = await prisma.overlay.findFirst({
        where: {
            id,
            user_id: user.id
        },
        include: {
            user: true
        }
    })

    if (!overlay) return notFound()

    return (
        <div className="flex flex-col gap-8 px-8 py-16">
            {{
                "CHAT": <ChatBoxConfig overlay={overlay}/>
            }[overlay.type]}
        </div>
    )
}