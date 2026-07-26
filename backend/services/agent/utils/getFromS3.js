import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getFromS3=async (filename,expiresIn=600)=>{
 const isS3Configured = process.env.AWS_ACCESS_KEY_ID && 
                       !process.env.AWS_ACCESS_KEY_ID.includes("add") && 
                       process.env.AWS_SECRET_KEY && 
                       !process.env.AWS_SECRET_KEY.includes("add") && 
                       process.env.AWS_BUCKET_NAME && 
                       !process.env.AWS_BUCKET_NAME.includes("add");

 const localFilePath = path.resolve(__dirname, '../public/uploads', filename);

 if (!isS3Configured || fs.existsSync(localFilePath)) {
   const baseUrl = process.env.PUBLIC_URL || "http://localhost:8003";
   return `${baseUrl}/uploads/${filename}`;
 }

 try {
   return await getSignedUrl(
     s3,
     new GetObjectCommand({
         Bucket:process.env.AWS_BUCKET_NAME,
         Key:filename
     }
     ),
     {expiresIn}
   )
 } catch (err) {
   console.warn("S3 getSignedUrl failed, trying local fallback:", err.message);
   const baseUrl = process.env.PUBLIC_URL || "http://localhost:8003";
   return `${baseUrl}/uploads/${filename}`;
 }
}