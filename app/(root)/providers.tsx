"use client"

import {NextUIProvider} from "@nextui-org/react"
import {ThemeProvider} from "next-themes"
import {Toaster} from "sonner"

export function Providers({children}) {
    return (
        <NextUIProvider>
            <ThemeProvider forcedTheme="dark" attribute="class">
                <Toaster theme="dark" richColors closeButton/>
                {children}
            </ThemeProvider>
        </NextUIProvider>
    )
}