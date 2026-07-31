import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/agent.route.js"
dotenv.config()

const port =process.env.PORT

import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")))
app.use("/",router)

app.use((err,req,res,next)=>{
  console.log(err)

  if(err.status){
    return res.status(err.status).json(err.data)
  }

  return res.status(500).json({message:`agent error ${err.message || err}`})
})


app.get("/",(req,res)=>{
    res.json({message:"hello from agent"})
})

app.listen(port,()=>{
    console.log(`agent started at ${port}`)
    connectDb()
})
