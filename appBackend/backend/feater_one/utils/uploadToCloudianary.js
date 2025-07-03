import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    
    const uploadOnCloudinary = async (localFilePath) => {
        try{
            if(!localFilePath) return null ;
            //  uplaod the file to cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "image"
            })
            // file has been uploaded successfully
            fs.unlinkSync(localFilePath) ;
            return response.url ;
        }catch (error){
            console.log(error);
            fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload operation got failed 
            return null ;
        }

    }
export { uploadOnCloudinary } ;