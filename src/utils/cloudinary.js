import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { apiError } from "../utils/apiError.js";
// import { log } from "console";


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadFileOnCloudinary=   async (localFilePath)=>{
        // let attempt=0;
        // console.log(localFilePath);
        
        try {
            const cloudres=  await cloudinary.uploader.upload(
                localFilePath,
                {
                    resource_type:"auto"
                }
            )
            // console.log("file uploaded" , cloudres.url);
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

    const deleteFilesFromCloudinary=async(cloudFileUrl)=>{
        try {
            // console.log(cloudFileUrl);
            const cloudres=  await cloudinary.uploader.destroy(cloudFileUrl)
            console.log(cloudres);
            
            return cloudres;
        } catch (error) {
            // throw new apiError(500,"error deleting the video")
            return null;
        }
    }

export {
    uploadFileOnCloudinary,
    deleteFilesFromCloudinary
}