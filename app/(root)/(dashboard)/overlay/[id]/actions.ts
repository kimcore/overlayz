"use server"

import {ChatBoxConfig} from "@/app/o/config"
import {getSession} from "@/auth/lucia"
import prisma from "@/database/prisma"

export async function saveChatBoxConfig(id: string, newConfig: ChatBoxConfig) {
    const {session: {user}} = await getSession()

    await prisma.overlay.update({
        where: {
            id,
            user_id: user.id
        },
        data: {
            config: newConfig
        }
    })
}