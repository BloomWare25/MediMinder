import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { uploadOnCloudinary } from '../utils/uploadToCloudianary.js'
import fs from 'fs';
import FormData from 'form-data'
import {saveOtp , verifyOtp} from '../utils/otpStore.js'
import axios from 'axios' ;

const mailgunDomain = process.env.MAILGUN_DOMAIN ;
const mailgunApiKey = process.env.MAILGUN_API_KEY ; 

// send otp function to the user email
const sendOtp = asyncHandler( async (email , otp) => {
    const form = new FormData();
    form.append('from', `YourAppName <mailgun@${mailgunDomain}>`);
    form.append('to', email);
    form.append('subject', 'Your OTP Code');
    form.append('text', `Your OTP code is: ${otp}. It will expire in 5 minutes.`);
  
    await axios.post(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, form, {
      auth: {
        username: 'api',
        password: mailgunApiKey,
      },
      headers: form.getHeaders(),
    });
})

// Api 1 registering a user 
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

    let otp = Math.floor(100000 + Math.random() * 900000) ; // generate a random 6 digit number
    await saveOtp(user.email , otp) ; // save the otp to the file
    await sendOtp(user.email , otp ) ; 
    const createdUser = await User.findById(user._id).select("-password -refreshToken")// we don't want to send the password and refresh token to the client
    return res
    .status(201)
    .json(
        new ApiResponse(201 , createdUser , "User has been created successfully")
    )
})
// Api 2 otp verification
const ifOtpVerified = asyncHandler( async (req , res) => {
    const {email , otp} = req.body ;

    const isOtpCorrect = await verifyOtp(email , otp) ;
    if(!isOtpCorrect){
        throw new ApiError(400 , "invalid otp or otp expired") ;
    }

    const user = await User.findOne(email) ;
    if(!user){
        throw new ApiError(500 , "Something went wrong while verifying your otp") ;
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200 , user , "User has been verified successfully")
    )
})
export {
    regUser , 
    ifOtpVerified , 
}