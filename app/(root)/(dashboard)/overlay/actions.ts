"use server"

import {getSession} from "@/auth/lucia"
import prisma from "@/database/prisma"
import ShortUniqueId from "short-unique-id"
import {defaultConfig} from "@/app/o/config"

const {randomUUID} = new ShortUniqueId({length: 10})

export async function createOverlay(name: string) {
    const {session: {user}} = await getSession()

    await prisma.overlay.create({
        data: {
            id: randomUUID(),
            user_id: user.id,
            name,
            type: "CHAT",
            config: defaultConfig
        }
    })
}