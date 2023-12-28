import {nextui} from "@nextui-org/react"
import tailwindAnimated from "tailwindcss-animated"
import type {Config} from "tailwindcss"

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Pretendard Variable"]
            },
            colors: {
                whitealpha: {
                    50: "rgba(255, 255, 255, 0.04)",
                    100: "rgba(255, 255, 255, 0.06)",
                    200: "rgba(255, 255, 255, 0.08)",
                    300: "rgba(255, 255, 255, 0.16)",
                    400: "rgba(255, 255, 255, 0.24)",
                    500: "rgba(255, 255, 255, 0.36)",
                    600: "rgba(255, 255, 255, 0.48)",
                    700: "rgba(255, 255, 255, 0.64)",
                    800: "rgba(255, 255, 255, 0.80)",
                    900: "rgba(255, 255, 255, 0.92)"
                },
                blackalpha: {
                    50: "rgba(0, 0, 0, 0.04)",
                    100: "rgba(0, 0, 0, 0.06)",
                    200: "rgba(0, 0, 0, 0.08)",
                    300: "rgba(0, 0, 0, 0.16)",
                    400: "rgba(0, 0, 0, 0.24)",
                    500: "rgba(0, 0, 0, 0.36)",
                    600: "rgba(0, 0, 0, 0.48)",
                    700: "rgba(0, 0, 0, 0.64)",
                    800: "rgba(0, 0, 0, 0.80)",
                    900: "rgba(0, 0, 0, 0.92)"
                },
            },
            keyframes: {
                levitate: {
                    "0%": {
                        transform: "translateY(0)",
                    },
                    "30%": {
                        transform: "translateY(-10px)",
                    },
                    "50%": {
                        transform: "translateY(4px)",
                    },
                    "70%": {
                        transform: "translateY(-15px)",
                    },
                    "100%": {
                        transform: "translateY(0)",
                    },
                },
            }
        },
    },
    darkMode: "class",
    plugins: [
        nextui({
            prefix: "zzzk"
        }),
        tailwindAnimated
    ]
} satisfies Config
