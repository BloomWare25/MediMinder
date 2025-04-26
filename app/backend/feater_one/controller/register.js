import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { uploadOnCloudinary } from '../utils/uploadToCloudianary.js'
import fs from 'fs';


// registering a user 
const regUser = asyncHandler( async (req , res) => {
    const {email , fullName , gender , password} = req.body ;
    if([email , fullName , gender , password].some((field) => field?.trim() === "")){
        throw new ApiError(400 , "All fields are required") ;
    }
    
    const existedUser = await User.findOne({email}) ;
    if(existedUser){
        throw new ApiError(400 , "User alreday exists")
    }
    let ImageLocalPath = null ; 
    if(req.file !== null){
        ImageLocalPath = req.file?.path ;
    }
    

    if(!ImageLocalPath){
        throw new ApiError(400 , "Please upload your profile image") ;
    }

    const avatar = await uploadOnCloudinary(ImageLocalPath) ;
    if(!avatar){
        throw new ApiError(501 , "Something went wrong while uploading your image") ;
    }

    const user = await User.create({
        email : email ,
        fullName : fullName ,
        password : password ,
        gender : gender ,
        avatar : avatar
    }) ; 

    if(!user){
        fs.unlinkSync(ImageLocalPath) ;
        throw new ApiError(502 , "Something went wrong while creating your account") ;
    }
    const createdUser = await User.findById(user._id).select("-password -refreshToken")// we don't want to send the password and refresh token to the client
    res
    .status(201)
    .json(
        new ApiResponse(201 , createdUser , "User has been created successfully")
    )
})

export {
    regUser , 
}