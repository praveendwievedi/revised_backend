import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadFileOnCloudinary=   async (localFilePath)=>{
        // let attempt=0;
        try {
            const cloudres=  await cloudinary.uploader.upload(
               localFilePath,
                {
                    resource_type:"auto"
                }
            )
            console.log("file uploaded" , cloudres.url);
            fs.unlinkSync(localFilePath)
            return cloudres;
        } catch (error) {
            // attempt++;
            // if (attempt<maxAttempt) {
            //     console.log("file upload failed attempt");
            //     return null;
            // }
            fs.unlinkSync(localFilePath);
            return null;
        }
    }

export {
    uploadFileOnCloudinary
}