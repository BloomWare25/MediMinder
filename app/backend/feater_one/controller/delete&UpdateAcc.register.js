import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import nodemailer from 'nodemailer' ;
import { genAccessRefreshToken }  from './register.js'
import { findUser } from "../utils/finduser.js"
import 'dotenv/config' ; 


const Mygmail = process.env.MY_GMAIL ;
const MyAppPass = process.env.MY_MAILING_APP_PASSWORD ; 

// Step 1: Configure transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: Mygmail,          // Your Gmail
    pass:  MyAppPass            // 16-digit App Password
  }
});

const delmail = (email , name) => {
  const mailOptions = {
    from: Mygmail,
    to: email,
    subject: 'Account delete Notification',
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deletion Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #FF4C4C;
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
        .footer {
            font-size: 12px;
            color: #777;
            text-align: center;
            padding: 10px 20px;
        }
        .cta-button {
            display: inline-block;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #FF4C4C;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .cta-button:hover {
            background-color: #E04343;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>💊 MediMinder 💊</h2>
        </div>
        <div class="content">
            <h2>Hello ${name},</h2>
            <p>We’re sorry to see you go! This email confirms that your MediMinder account has been successfully deleted.</p>
            <p>If you didn’t request this action or believe this was a mistake, please contact our support team immediately.</p>
            <p>Thank you for being a part of MediMinder. We hope to see you again in the future!</p>
            <a href="https://yourdomain.com/contact-support" class="cta-button">Contact Support</a>
        </div>
        <div class="footer">
            If you have any questions or need assistance, feel free to contact our support team at <a href="mailto:phoenixdev2025@gmail.com">phoenixdev2025@gmail.com</a>.<br>
            Thank you for choosing MediMinder!<br>
            <strong>💊 The MediMinder Team 💊</strong>
        </div>
    </div>
</body>
</html>
    `
    }
    transporter.sendMail(mailOptions, (error, info) => {
        try {
          if (error) {
            console.error('deletion msg failed', error);
            throw new ApiError(500 , error , "deletion msg failed") ;
          } else {
            console.log('delete account email sent:', info.response);
          }
        } catch (error) {
          throw new ApiError(500 , error , "deletion msg failed") ;
        }
      });
}

// Api 6 delete the user account
const delacc = asyncHandler(async (req , res) => {
    const user = req.user ;
    const isdel = await User.findByIdAndDelete(user._id) ;
    if(!isdel){
        return res
        .status(501)
        .json(
            new ApiError(501 , {
                success: false,
                message: "Unable to delete the account",
            }))
    }
    setTimeout(() => {
        delmail(isdel.email , isdel.fullName) ;  
    }, 600)  ;
    return res
    .status(200)
    .json(
        new ApiResponse(200 ,{
            success: true,
            message: "Account deleted successfully",
        })
    )
})

// Api 7 update the tokens refresh and access both 
const updateToken = asyncHandler(async (req , res) => {
    const user = req.user ;
    const { accesstoken , refreshtoken } = await genAccessRefreshToken(user._id) ;
    if(!accesstoken || !refreshtoken){
        throw new ApiError(501 , null , "Can't create new access or refresh token")
    }
    user.refreshToken = refreshtoken ;
    // const userCred = await user.select("-password -refreshToken") //user credentials 
    return res
    .status(200)
    .json(
        new ApiResponse(200 , { user  , "accesstoken" : accesstoken}, "New Tokens have been generated")
    )

})

// Api 8 update user credentials password and other user credentials in totally other routes
// Password update here
const updatePass = asyncHandler(async (req , res) => {
    const { oldpassword , newpassword } = req.body ;
    console.log(oldpassword , newpassword); 
    const user = req.user ;
    const dbUser = await findUser(user._id) 
    console.log(dbUser);
    
    const ifPassCorrect = await dbUser.isPasswordCorrect(oldpassword) ;
    if(!ifPassCorrect){
        return res
        .status(303)
        .json(
            new ApiError(303 , null , "Incorrect password!")
        )
    }
    dbUser.password = newpassword ;
    const updatedUser = await dbUser.save({validateBeforeSave: false}) ;
    console.log(updatedUser);
    
    if(!updatedUser){
        return res
        .status(500)
        .json(
            new ApiError(500 , null , "Something went wrong while updating the user password")
        )
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200 , updatedUser , "password has been changed ")
    )
})
export {
    delacc ,
    updateToken ,
    updatePass 
}