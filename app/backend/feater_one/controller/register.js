import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { TemporarySignup } from '../models/userTemData.models.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { uploadOnCloudinary } from '../utils/uploadToCloudianary.js'
import fs from 'fs';
import { verifyOtp } from "../utils/verifyOtp.js"
import nodemailer from 'nodemailer' ;
import 'dotenv/config' ; 

const Mygmail = process.env.MY_GMAIL ;
const MyAppPass = process.env.MY_MAILING_APP_PASSWORD ; 



// send otp function to the user email


// Step 1: Configure transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: Mygmail,          // Your Gmail
    pass:  MyAppPass            // 16-digit App Password
  }
});

// Step 2: Function to send OTP
function sendOtp(recipientEmail, otpCode) {
  const mailOptions = {
    from: Mygmail,
    to: recipientEmail,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otpCode}. It will expire in 5 minutes.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP email:', error);
    } else {
      console.log('OTP email sent:', info.response);
    }
  });
}



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

        const tempUserExist = await TemporarySignup.findOne({email});
        if(tempUserExist){
            await TemporarySignup.findByIdAndUpdate(
                tempUserExist._id , 
                {
                    $set: {
                        otp: otp ,
                        otpExpiry: otpExpiry 
                    }
                },
                // {
                //     new: true
                // }
            )
        }
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
    
    const {email , otp} = req.body ;
    console.log(email , otp);
    

    const isOtpUser = await verifyOtp(email , otp) ;
    console.log(isOtpUser);
    
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
        new ApiResponse(200 , createdUser , "User has been verified successfully")
    )
})
export {
    regUser , 
    ifOtpVerified , 
}