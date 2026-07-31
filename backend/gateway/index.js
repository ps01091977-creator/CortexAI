import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
dotenv.config()
import cookieParser from "cookie-parser"
import { getCurrentUser } from "./controllers/user.controller.js"
import protect from "./middleware/auth.middleware.js"
import { proxyWithHeader } from "./utils/proxyWithHeader.js"
import morgan from "morgan"
const port =process.env.PORT

const app=express()
app.use((req, res, next) => {
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        "https://cortexai-2.onrender.com",
        "http://localhost:5173"
    ].filter(Boolean);
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-user-id");
    }
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});
app.use(morgan("dev"))
app.use(cookieParser())
const AUTH_SERVICE = process.env.AUTH_SERVICE || "http://localhost:8001"
const CHAT_SERVICE = process.env.CHAT_SERVICE || "http://localhost:8002"
const AGENT_SERVICE = process.env.AGENT_SERVICE || "http://localhost:8003"

app.use("/api/auth",proxyWithHeader(AUTH_SERVICE))
app.use("/api/chat",protect,proxyWithHeader(CHAT_SERVICE))
app.use("/api/agent",protect,proxyWithHeader(AGENT_SERVICE))
app.get("/api/me",protect,getCurrentUser)
app.get("/",(req,res)=>{
    res.json({message:"hello from gateway v5"})
})

app.listen(port,()=>{
    console.log(`gateway started at ${port}`)
})
