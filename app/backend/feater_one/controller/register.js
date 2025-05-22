import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { TemporarySignup } from '../models/userTemData.models.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { uploadOnCloudinary } from '../utils/uploadToCloudianary.js'
import fs, { access } from 'fs';
import nodemailer from 'nodemailer' ;
import { verifyOtp } from '../utils/verifyOtp.js'
import 'dotenv/config' ; 
import { client } from '../db/redis.db.js'



const Mygmail = process.env.MY_GMAIL ;
const MyAppPass = process.env.MY_MAILING_APP_PASSWORD ; 



// token genereation function
const genAccessRefreshToken = async (userID) => {
    try {
      
      const user = await User.findById(userID) ;

      if(!user){
        throw new ApiError(404 , null , "User not found") ;
      }
      
      
      const accesstoken = await user.generateAccessToken() ;
      const refreshtoken = await user.generateRefreshToken() ;
      
      if(!accesstoken || !refreshtoken){
        throw new ApiError(500 , null , "server issue generating token") ;
      }
      
      user.refreshToken = refreshtoken ;

      await user.save({validateBeforeSave : false})
      return { accesstoken , refreshtoken } ;
    } catch (error) {
      throw new ApiError(500 , error , "server issue creating token") ;
    }
}


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
          background-color: rgb(43, 99, 219);
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
          <img src="/mediminder_logo.jpg" alt="MediMinder Logo" />
          <h2>💊 MediMinder 💊</h2>
        </div>
        <div class="content">
          <p>👋 Hello,</p>
          <p>🔑 Use the OTP below to complete your registration:</p>
          <div class="otp">${otpCode}</div>
          <p>⏳ This OTP will expire in 10 minutes. 🚫 Do not share it with anyone.</p>
        </div>
        <div class="footer">
          <p>❓ If you didn’t request this, you can ignore this email.</p>
          <p>🙏 Thank you for using MediMinder! 🙏</p>
        </div>
      </div>
    </body>
    </html>
  `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
      .status(501)
      .json(
        new ApiError(501 , null , "Can't send the otp")
      )
      console.error('Error sending OTP email:', error);
    } else {
      console.log('OTP email sent:', info.response);
    }
  });
}

// function for sending response to the client that the user has been registered successfully
const sendUserSuccessfull = ( recipientEmail , name) => {
  const mailOptions = {
    from: Mygmail,
    to: recipientEmail,
    subject: 'Registration Successful',
    html:`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Successful</title>
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
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .cta-button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="/mediminder_logo.jpg" alt="MediMinder Logo" />
            <h2>MediMinder</h2>
        </div>
        <div class="content">
            <h2>Hello ${name},</h2>
            <p>🎉 Congratulations! Your registration was successful. 🎉</p>
            <p>🙏 Thank you for joining us! 🙏</p>
            <p>We are excited to have you on board. With MediMinder, you can easily manage your medications, track your health, and stay on top of your medical needs.</p>
            <p>Here are some features you can explore:</p>
            <ul>
                <li>💊 Medication reminders</li>
                <li>📊 Health tracking</li>
                <li>📅 Appointment scheduling</li>
                <li>📂 Secure medical history storage</li>
            </ul>
            <p>Click the button below to log in and start using MediMinder:</p>
            <a href="https://yourdomain.com/login" class="cta-button">Log In to MediMinder</a>
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
  };
  transporter.sendMail(mailOptions, (error, info) => {
    try {
      if (error) {
        console.error('success msg failed', error);
        return res
      .status(501)
      .json(
        new ApiError(501 , null , "Can't send the otp")
      )
      } else {
        console.log('OTP email sent:', info.response);
      }
    } catch (error) {
      throw new ApiError(500 , error , "success msg failed") ;
    }
  });
}

const sendUserLogedIn = (recipientEmail , name) => {
  const loginTime = new Date().toLocaleString() ; 
  const mailOptions = {
    from: Mygmail,
    to: recipientEmail,
    subject: 'Login Notification',
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Notification</title>
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
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .cta-button:hover {
            background-color: #45a049;
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
            <p>👋 We noticed a login to your MediMinder account.</p>
            <p>📅 Date and Time: ${loginTime}</p>
            <p>If this was you, you can safely ignore this email. If you suspect any unauthorized access, please reset your password immediately.</p>
            <a href="https://yourdomain.com/reset-password" class="cta-button">Reset Password</a>
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
  };
  transporter.sendMail(mailOptions, (error, info) => {
    try {
      if (error) {
        console.error('success msg failed', error);
        throw new ApiError(500 , error , "success msg failed") ;
      } else {
        console.log('OTP email sent:', info.response);
      }
    } catch (error) {
      throw new ApiError(500 , error , "success msg failed") ;
    }
  });
}
// Api 1 registering a user 
const regUser = asyncHandler( async (req , res) => {
    const {email , fullName , gender , age , password} = req.body ;
    
    
    if([email , fullName , gender , age , password].some((field) => field?.trim() === "")){
        return res
        .status(402)
        .json(
            new ApiError(402 , null , "All fields are required")
        )
    }
    const ifAlreadyExists = await User.findOne({email}) ;
    if(ifAlreadyExists){
       return res
       .status(400)
       .json(
          new ApiError(400 , null , "User already exists" )
       )}

    try {
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
          const newTempUser = await TemporarySignup.findByIdAndUpdate(
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
                age ,
                avatar
            }
        })

        
        if(!user){
            fs.unlinkSync(ImageLocalPath) ;
            throw new ApiError(502 , "Something went wrong while creating your account") ;
        }
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
    if([email , otp].some((field) => field?.trim() === "")){
      return res
      .status(402)
      .json(
        new ApiError(402 , null , "All fields are required")
      );
    }
   try {
     const existedUser = await User.findOne({email}) ;
     if(existedUser){
       return res
       .status(400)
       .json(
         new ApiError(400 , null , "User already exists")
       )
     }
     
     const userData = await verifyOtp(email, otp);
     
     
     if (!userData) {
         throw new ApiError(404, "Invalid OTP or OTP verification failed");
     }
 
     const {fullName , gender , password , age , avatar } = userData ;
     const user = await User.create(
         {
             email: email,
             fullName: fullName ,
             gender: gender ,
             password: password,
             avatar: avatar ,
             age: age ,
             refreshToken: null ,
              medical_history: [],
              medication: []
         }
     )
     if(!user){
         throw new ApiError(501 , "Server can't create the user. please re register ")
     }
 
     sendUserSuccessfull(user.email , user.fullName) ; 
     
     return res 
     .status(200)
     .json(
         new ApiResponse(200 , user , "User has been verified & created successfully")
     )
   } catch (error) {
    throw new ApiError(500 , error , "server issue")
   }
})

// Api 3 Login user
const loginUser = asyncHandler( async (req , res)=> {
  const { email , password } = req.body ;
  if([email , password].some((field) => field?.trim() === "")) {
    return res
    .status(402)
    .json(
        new ApiError(402 , null , "All fields are required")
    )
  }
  try {
    const user = await User.findOne({email}).select("+_id") ;

    if(!user){
        return res
        .status(404)
        .json(
            new ApiError(404 , null , "User not found")
        )
    }
    const ifpasswordCorrect = await user.isPasswordCorrect(password) ;

    if(!ifpasswordCorrect){
        return res
        .status(401)
        .json(
            new ApiError(401 , null , "Password is incorrect")
        )
    }
    
    
    const user_id = user._id ;
   

    const { accesstoken , refreshtoken }= await genAccessRefreshToken(user_id) ;

    user.refreshToken = refreshtoken ;
    await sendUserLogedIn(email , user.fullName) ;
    return res
    .status(200)
    .json(
      new ApiResponse(200 , {user , accesstoken} , "User logged in successfully")
    )
  } catch (error) {
    throw new ApiError(501 , error , "server issue to getting user at log in")
  }
})

// Api 4 get user details 
const userDetails = asyncHandler( async (req , res) => {
  const user = req.user ;
  if(!user){
    return res
    .status(404)
    .json(
        new ApiError(404 , null , "User not found")
    )
  }
  const userData = await User.findById(user._id).select("-password -refreshToken") ;
  if(!userData){
    return res
    .status(404)
    .json(
        new ApiError(404 , null , "User not found")
    )
  }

const redisUserData = {
  name: userData.fullName ?? '',
  age: userData.age?.toString() ?? '',
  email: userData.email ?? '',
  gender: userData.gender ?? '',
  avatar: userData.avatar ?? ''
};

await client.hset(`user:${userData._id}`, redisUserData);
await client.expire(`user:${userData._id}`, (process.env.REDIS_DEFAULT_EXPIRY));

  return res 
  .status(200)
  .json(
    new ApiResponse(200 , userData , "User details fetched successfully")
  )
})

// Api 5 Logout user 
const logoutUser = asyncHandler( async (req , res) => {
  const user = req.user ;
  if(!user){
    return res
    .status(404)
    .json(
      new ApiError(404 , null , "User not found") 
    )
  }
  const userData = await User.findById(user._id) ;
  if(!userData){
    return res 
    .status(402)
    .json(
      new ApiError(402 , null , "User not exist please check your token")
    )
  }
  userData.refreshToken = null ;
  userData.accesstoken = null ;
  await userData.save({validateBeforeSave: false}) ;
  const newUser = await User.findById(userData._id) ;
  
    return res
  .status(200)
  .json(
    new ApiResponse(200 , null , "User logged out successfully")
  )
})
export {
    regUser , 
    ifOtpVerified , 
    loginUser , 
    userDetails ,
    logoutUser ,
    genAccessRefreshToken
}