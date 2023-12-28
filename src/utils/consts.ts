export const __PROD__ = process.env.NODE_ENV === "production"

export const __DEV__ = !__PROD__

export const __CLIENT__ = typeof window === "undefined"

export const __SERVER__ = !__CLIENT__
export const __BASE_URL__ = __PROD__ ? "https://overlayz.kr" : "http://localhost:3000"