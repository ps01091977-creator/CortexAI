import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "../config/s3.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadToS3=async (filename,buffer,contentType)=>{
 const isS3Configured = process.env.AWS_ACCESS_KEY_ID && 
                       !process.env.AWS_ACCESS_KEY_ID.includes("add") && 
                       process.env.AWS_SECRET_KEY && 
                       !process.env.AWS_SECRET_KEY.includes("add") && 
                       process.env.AWS_BUCKET_NAME && 
                       !process.env.AWS_BUCKET_NAME.includes("add");

 if (isS3Configured) {
   try {
     await s3.send(
        new PutObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Body:buffer,
            Key:filename,
            ContentType:contentType
        })
     )
     return filename
   } catch (s3Err) {
     console.warn("S3 upload failed, falling back to local storage:", s3Err.message);
   }
 }

 // Local storage fallback
 const uploadDir = path.resolve(__dirname, '../public/uploads');
 if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true });
 }
 const filepath = path.join(uploadDir, filename);
 fs.writeFileSync(filepath, buffer);
 return filename
}