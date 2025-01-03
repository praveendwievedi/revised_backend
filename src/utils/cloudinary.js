import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadFileOnCloudinary=   async (filePath)=>{
        // let attempt=0;
        try {
            const cloudres=  await cloudinary.uploader.upload(
                "",
                {
                    resource_type:"auto"
                }
            )
            console.log("file uploaded" , cloudres.url);
            fs.unlink(filePath)
            return cloudres
        } catch (error) {
            // attempt++;
            // if (attempt<maxAttempt) {
            //     console.log("file upload failed attempt");
            //     return null;
            // }
            fs.unlink(filePath);
            return null;
        }
    }

export {
    uploadFileOnCloudinary
}