import {getSession} from "@/auth/lucia"
import {NewOverlay, Overlay} from "./overlay"
import prisma from "@/database/prisma"

export default async function OverlaysPage() {
    const {session: {user}} = await getSession()
    const overlays = await prisma.overlay.findMany({where: {user_id: user.id}})

    return (
        <div className="flex justify-center gap-4 py-16">
            <div className="grid grid-cols-2 gap-6">
                {overlays.sort((a, b) =>
                    a.created.getTime() - b.created.getTime()
                ).map(overlay => (
                    <Overlay key={overlay.id} overlay={overlay}/>
                ))}
                <NewOverlay count={overlays.length}/>
            </div>
        </div>
    )
}