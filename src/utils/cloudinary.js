import {v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

const uploadedFileOnCloudinary=async(localPath)=>{
    try{
        if(!localPath) return null;
        const response=await cloudinary.uploader.upload(localPath,{
            resource_type: "auto",
        })
        console.log("File uploaded on Cloudinary:", response.secure_url);
        fs.unlinkSync(localPath);
        return response;

    }catch(err){
        console.error("Cloudinary upload error:", err);
        if(fs.existsSync()){
            fs.unlinkSync(localPath);
        }
        return null;

    }
}



 const deleteFileFromCloudinary = async (fileUrl) => {
    try {
        // Extract public_id from Cloudinary URL
        const publicId = fileUrl.split('/').pop().split('.')[0];
        await cloudinary.v2.uploader.destroy(publicId);
        console.log(`Deleted file from Cloudinary: ${fileUrl}`);
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
    }
};

export {uploadedFileOnCloudinary,deleteFileFromCloudinary};


