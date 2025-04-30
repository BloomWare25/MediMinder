import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { TemporarySignup } from '../models/userTemData.models.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { uploadOnCloudinary } from '../utils/uploadToCloudianary.js'
import fs from 'fs';
import FormData from 'form-data'
import { verifyOtp } from "../utils/verifyOtp.js"
import axios from 'axios';

import 'dotenv/config' ; 

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
    
    try {
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
       
        // generate a random 6 digit number
        let otp = Math.floor(100000 + Math.random() * 900000) ; 
        const otpExpiry = Date.now() + 10 * 60 * 1000 // otp expiry withing
        const user = await TemporarySignup.create({
            email : email ,
            otp: otp,
            otpExpiry: otpExpiry ,
            userData: {
                fullName ,
                password ,
                gender ,
                avatar
            }
        })
    
        if(!user){
            fs.unlinkSync(ImageLocalPath) ;
            throw new ApiError(502 , "Something went wrong while creating your account") ;
        }
        console.log(otp);
        await sendOtp(email , otp ) ; 
        // const createdUser = await User.findById(user._id).select("-password -refreshToken")// we don't want to send the password and refresh token to the client
        return res
        .status(201)
        .json(
            new ApiResponse(201 , "Otp has sent to the email")
        )
    } catch (error) {
        throw new ApiError(500 , "server issue")
    }
})
// Api 2 otp verification
const ifOtpVerified = asyncHandler( async (req , res) => {
    console.log(req.body);
    
    const {email , otp} = req.body ;

    const isOtpUser = await verifyOtp(email , otp)
    const { userData } = isOtpUser ;
    const user = await User.create(
        {
            email: email,
            fullName: userData.fullName ,
            gender: userData.gender ,
            password: userData.password,
            avatar: userData.avatar ,
        }
    )
    if(!user){
        throw new ApiError(501 , "Server can't create the user. please re register ")
    }
    const createdUser = User.findById(user._id).select("-refreshToken -password")
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