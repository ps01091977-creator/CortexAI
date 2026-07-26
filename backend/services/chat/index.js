import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/chat.routes.js"

dotenv.config()

const port =process.env.PORT

const app=express()
app.use(express.json())

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

app.use("/",router)
app.get("/",(req,res)=>{
    res.json({message:"hello from chat"})
})

app.listen(port,()=>{
    console.log(`chat started at ${port}`)
    connectDb()
})
