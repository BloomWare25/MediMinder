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
import mongoose from 'mongoose'

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
    if (!recipientEmail || typeof recipientEmail !== 'string') {
        console.error('Invalid recipient email:', recipientEmail);
        return;
      }
  const mailOptions = {
    from: Mygmail,
    to: recipientEmail,
    subject: 'Your OTP Code',
    html: `
        <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>MediMinder OTP</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 480px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background-color: #4CAF50;
          padding: 20px;
          text-align: center;
          color: white;
        }
        .header img {
          max-height: 50px;
        }
        .content {
          padding: 20px;
        }
        .otp {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          font-size: 12px;
          color: #777;
          text-align: center;
          padding: 10px 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://yourdomain.com/logo.png" alt="MediMinder Logo" />
          <h2>MediMinder</h2>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Use the OTP below to complete your registration:</p>
          <div class="otp">${otpCode}</div>
          <p>This OTP will expire in 10 minutes. Do not share it with anyone.</p>
        </div>
        <div class="footer">
          If you didn’t request this, you can ignore this email.<br>
          Thank you for using MediMinder!<br>
        </div>
      </div>
    </body>
    </html>
  `
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
    const ifAlreadyExists = await User.findOne({email}) ;
    if(ifAlreadyExists){
      throw new ApiError(400 , "User already exists")
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
        const otpExpiry = Date.now() + 10 * 60 * 1000 // otp expiry withing 10 minutes

        const tempUserExist = await TemporarySignup.findOne({email});
        if(tempUserExist){
            await TemporarySignup.findByIdAndUpdate(
                tempUserExist._id, 
                {
                    $set: {
                        otp: otp ,
                        otpExpiry: otpExpiry 
                    }
                },
                {
                    new: true , 
                    runValidators: true 
                }
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
        throw new ApiError(500 , error , "server issue")
    }
})
// Api 2 otp verification
const ifOtpVerified = asyncHandler( async (req , res) => {
    
    const {email , otp} = req.body ;
    
    const userData = await verifyOtp(email, otp);
    if (!userData) {
        throw new ApiError(400, "Invalid OTP or OTP verification failed");
    }

    const {fullName , gender , password , avatar } = userData ;
    const user = await User.create(
        {
            email: email,
            fullName: fullName ,
            gender: gender ,
            password: password,
            avatar: avatar ,
        }
    )
    if(!user){
        throw new ApiError(501 , "Server can't create the user. please re register ")
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(200 , user , "User has been verified & created successfully")
    )
})
export {
    regUser , 
    ifOtpVerified , 
}