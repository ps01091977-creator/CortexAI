import redis from "../../shared/redis/redis.js"

const protect = async (req, res, next) => {
    try {
        const sessionId = req.cookies?.session
        if (!sessionId) {
            req.user = { userId: "guest_user", name: "Guest User" }
            return next()
        }
        let session = await redis.get(`session-${sessionId}`)
        if (!session) {
            req.user = { userId: "guest_user", name: "Guest User" }
            return next()
        }
        req.user = typeof session === 'string' ? JSON.parse(session) : session
        return next()
    } catch (error) {
        req.user = { userId: "user_default", name: "User" }
        return next()
    }
}

export default protect