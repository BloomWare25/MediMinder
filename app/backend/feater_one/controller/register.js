import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { TemporarySignup } from '../models/userTemData.models.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { uploadOnCloudinary } from '../utils/uploadToCloudianary.js'
import fs, { access } from 'fs';
import nodemailer from 'nodemailer';
import { verifyOtp } from '../utils/verifyOtp.js'
import { isTokenBlocked } from '../Middleware/checkForValidToken.js'
import { ExpiredToken } from '../models/expireToken.model.js'
import 'dotenv/config';
import { client } from '../db/redis.db.js'



const Mygmail = process.env.MY_GMAIL;
const MyAppPass = process.env.MY_MAILING_APP_PASSWORD;



// token genereation function
const genAccessRefreshToken = async (userID) => {
  try {

    const user = await User.findById(userID);

    if (!user) {
      throw new ApiError(404, null, "User not found");
    }


    const accesstoken = await user.generateAccessToken();
    const refreshtoken = await user.generateRefreshToken();

    if (!accesstoken || !refreshtoken) {
      throw new ApiError(500, null, "server issue generating token");
    }

    user.refreshToken = refreshtoken;

    await user.save({ validateBeforeSave: false })
    return { accesstoken, refreshtoken };
  } catch (error) {
    throw new ApiError(500, error, "server issue creating token");
  }
}


// Step 1: Configure transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: Mygmail,          // Your Gmail
    pass: MyAppPass            // 16-digit App Password
  }
});

// Step 2: Function to send OTP
function sendOtp(recipientEmail, otpCode) {
  if (!recipientEmail || typeof recipientEmail !== 'string') {
    console.error('Invalid recipient email:', recipientEmail);
    return;
  }
  // sencing otp 
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
          max-height: 150px;
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
          <img src="https://res.cloudinary.com/dgyy4hghb/image/upload/v1748085861/medimindr_logo_sok7zq.jpg" alt="MediMinder Logo" />
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
          new ApiError(501, null, "Can't send the otp")
        )
    } else {
      console.log('OTP email sent:', info.response);
    }
  });
}

// function for sending response to the client that the user has been registered successfully
const sendUserSuccessfull = (recipientEmail, name) => {
  const mailOptions = {
    from: Mygmail,
    to: recipientEmail,
    subject: 'Registration Successful',
    html: `
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
            max-height: 150px;
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
        img{
            
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://res.cloudinary.com/dgyy4hghb/image/upload/v1748085861/medimindr_logo_sok7zq.jpg" alt="MediMinder Logo" />
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
            new ApiError(501, null, "Can't send the otp")
          )
      } else {
        console.log('OTP email sent:', info.response);
      }
    } catch (error) {
      throw new ApiError(500, error, "success msg failed");
    }
  });
}
// log in mssg sending 
const sendUserLogedIn = (recipientEmail, name) => {
  const loginTime = new Date().toLocaleString();
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
        return res
          .status(501)
          .json(
            new ApiError(501, null, "Can't send the otp")
          )
      } else {
        console.log('OTP email sent:', info.response);
      }
    } catch (error) {
      return res
        .status(501)
        .json(
          new ApiError(501, null, "Can't send the otp")
        )
    }
  });
}
// any failure message 
const systemFailureMail = (error) => {
  const loginTime = new Date().toLocaleString();
  const mailOptions = {
    from: Mygmail,
    to: process.env.DEBANJAN_EMAIL,
    subject: 'System Failure',
    html: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>System Failure Alert</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f8f8f8; }
    .container { background: #fff; padding: 24px; border-radius: 8px; max-width: 500px; margin: 40px auto; box-shadow: 0 2px 8px #eee; }
    .header { color: #d32f2f; font-size: 22px; margin-bottom: 12px; }
    .error { background: #ffeaea; color: #b71c1c; padding: 12px; border-radius: 4px; margin: 16px 0; font-family: monospace; }
    .footer { font-size: 12px; color: #888; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🚨 System Failure Detected in Mediminder</div>
    <p>Dear Admin,</p>
    <p>An error has occurred in your system. Please review the details below:</p>
    <div class="error">
      ${error}
    </div>
    <p>Please take the necessary actions to resolve this issue.</p>
    <div class="footer">
      This is an automated alert from your MediMinder system.
    </div>
  </div>
</body>
</html>`
  }
}
// Api 1 registering a user 
const regUser = asyncHandler(async (req, res) => {
  const { email, fullName, gender, age, password } = req.body;


  if ([email, fullName, gender, age, password].some((field) => field?.trim() === "")) {
    return res
      .status(402)
      .json(
        new ApiError(402, null, "All fields are required")
      )
  }
  const ifAlreadyExists = await User.findOne({ email });
  if (ifAlreadyExists) {
    return res
      .status(400)
      .json(
        new ApiError(400, null, "User already exists")
      )
  }

  try {
    let ImageLocalPath = null;
    let avatar = null;
    // if the user has uploaded an image
    if (req.file) {
      ImageLocalPath = req.file?.path;
      // if(!ImageLocalPath){
      //     throw new ApiError(400 , "Please upload your profile image") ;
      // }

      avatar = await uploadOnCloudinary(ImageLocalPath);
      if (!avatar) {
        throw new ApiError(501, "Something went wrong while uploading your image");
      }
    }




    // generate a random 6 digit number
    let otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 10 * 60 * 1000 // otp expiry withing 10 minutes

    const tempUserExist = await TemporarySignup.findOne({ email });
    if (tempUserExist) {
      const newTempUser = await TemporarySignup.findByIdAndUpdate(
        tempUserExist._id,
        {
          $set: {
            otp: otp,
            otpExpiry: otpExpiry
          }
        },
        {
          new: true,
          runValidators: true
        }
      )
    }

    const user = await TemporarySignup.create({
      email: email,
      otp: otp,
      otpExpiry: otpExpiry,
      userData: {
        fullName,
        password,
        gender: gender || null,
        age,
        avatar: avatar || null
      }
    })


    if (!user) {
      fs.unlinkSync(ImageLocalPath);
      throw new ApiError(502, "Something went wrong while creating your account");
    }
    await sendOtp(email, otp);
    // const createdUser = await User.findById(user._id).select("-password -refreshToken")// we don't want to send the password and refresh token to the client
    return res
      .status(201)
      .json(
        new ApiResponse(201, "Otp has sent to the email")
      )
  } catch (error) {
    throw new ApiError(500, error, "server issue")
  }
})


// Api 2 otp verification for registration
const ifOtpVerified = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if ([email, otp].some((field) => field?.trim() === "")) {
    return res
      .status(402)
      .json(
        new ApiError(402, null, "All fields are required")
      );
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return res
      .status(400)
      .json(
        new ApiError(400, null, "User already exists")
      )
  }

  try {
    const userData = await verifyOtp(email, otp);
    // error handling for the edge error cases
    switch (userData) {
      case 'OU': return res
        .status(404)
        .json({
          stasusCode: 404,
          success: false,
          message: 'No user found please register first your session have been expired'
        })

      case '0OTP': return res
        .status(404)
        .json({
          stasusCode: 404,
          success: false,
          message: 'Invalid OTP! Please check the OTP again'
        });

      case '0EOTP': return res
        .status(404)
        .json({
          stasusCode: 404,
          success: false,
          message: 'otp has been expired'
        })
    }

    const { fullName, gender, password, age, avatar } = userData;

    const user = await User.create(
      {
        email: email,
        fullName: fullName,
        gender: gender,
        password: password,
        avatar: avatar,
        age: age,
        refreshToken: null,
        medical_history: [],
        medication: []
      }
    )
    if (!user) {
      throw new ApiError(501, "Server can't create the user. please re register ")
    }
    const isUserrevokes = await isTokenBlocked(email);
    if (isUserrevokes) {
      await ExpiredToken.findOneAndDelete({ email });
    }
    const { accesstoken, refreshtoken } = await genAccessRefreshToken(user._id);
    const tokenedUser = await User.findByIdAndUpdate(user._id,
      {
        $set: {
          refreshToken: refreshtoken,
        }
      }
    )

    setTimeout(async () => {
      sendUserSuccessfull(user.email, user.fullName);
    }, 500)

    return res
      .status(200)
      .json(
        new ApiResponse(200, { tokenedUser, accesstoken }, "User has been verified & created successfully")
      )
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(500, 'internal server error')
      )
  }
})

// Api 3 Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    return res
      .status(402)
      .json(
        new ApiError(402, null, "All fields are required")
      )
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json(
          new ApiError(404, null, "User not found")
        )
    }
    const ifpasswordCorrect = await user.isPasswordCorrect(password);

    if (!ifpasswordCorrect) {
      return res
        .status(401)
        .json(
          new ApiError(401, null, "Password is incorrect")
        )
    }


    const user_id = user._id;
    const isUserrevokes = await isTokenBlocked(email);
    if (isUserrevokes) {
      await ExpiredToken.findOneAndDelete({ email });
    }
    const { accesstoken, refreshtoken } = await genAccessRefreshToken(user_id);

    const redisUserData = {
      age: user.age?.toString() ?? '',
      email: user.email ?? '',
      gender: user.gender ?? '',
      avatar: user.avatar ?? '',
      name: user.fullName ?? '',
      medications: user.medication ?? '',
    };

    await client.hset(`user:${user_id}`, redisUserData);
    await client.expire(`user:${user_id}`, (process.env.REDIS_DEFAULT_EXPIRY));

    user.refreshToken = refreshtoken;
    const savedUser = await user.save({ validateBeforeSave: true });
    if (!savedUser) {
      return res
        .status(500)
        .json(
          new ApiError(500, null, "server got stucked somewhere while saving the user credentials")
        )
    }
    await sendUserLogedIn(email, user.fullName);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { user, accesstoken }, "User logged in successfully")
      )
  } catch (error) {
    await systemFailureMail(error)
    return res
    .status(500)
    .json(
      new ApiError(501, error, "server issue to getting user at log in")
    )
  }
})

// Api 4 get user details 
const userDetails = asyncHandler(async (req, res) => {

  const user = req.user;
  if (!user) {
    return res
      .status(404)
      .json(
        new ApiError(404, null, "User not found")
      )
  }
  const userData = await User.findById(user._id).select("-password -refreshToken");
  if (!userData) {
    return res
      .status(404)
      .json(
        new ApiError(404, null, "User not found")
      )
  }

  const redisUserData = {
    name: userData.fullName ?? '',
    age: userData.age ?? '',
    email: userData.email ?? '',
    gender: userData.gender ?? '',
    avatar: userData.avatar ?? ''
  };

  await client.hset(`user:${userData._id}`, redisUserData);
  await client.expire(`user:${userData._id}`, (process.env.REDIS_DEFAULT_EXPIRY));

  return res
    .status(200)
    .json(
      new ApiResponse(200, userData, "User details fetched successfully")
    )
})

// Api 5 Logout user 
const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res
      .status(404)
      .json(
        new ApiError(404, null, "User not found")
      )
  }
  const userData = await User.findById(user._id);
  if (!userData) {
    return res
      .status(402)
      .json(
        new ApiError(402, null, "User not exist please check your token")
      )
  }
  userData.refreshToken = null;
  userData.accesstoken = null;
  await userData.save({ validateBeforeSave: false });
  const newUser = await User.findById(userData._id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "User logged out successfully")
    )
})

// Api 10 forgot password log in
const loginpassForgotOtpSend = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    if ([email].some((field) => field?.trim() === "")) {
      return res
        .status(402)
        .json(
          new ApiError(402, null, "All fields are required")
        )
    }
    const otp = Math.floor(100000 + Math.random() * 900000); // generate a random 6 digit number


    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json(
          new ApiError(404, null, "User not found please register first")
        )
    }
    const otpExpiry = Date.now() + 10 * 60 * 1000; // otp expiry withing 10 minutes
    const tempUser = await TemporarySignup.create({
      email: email,
      otp: otp,
      otpExpiry: otpExpiry,
      userData: {
        fullName: user.fullName,
        password: user.password,
        gender: user.gender,
        age: user.age,
        avatar: user.avatar,
      }
    })
    if (!tempUser) {
      return res
        .status(501)
        .json(
          new ApiError(501, null, "Can't create temporary user for forgot password")
        )
    }
    await sendOtp(email, otp);

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Otp has been sent to your email for login")
      )
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(500, error, "server issue")
      )
  }
});
//  loginPassforgot 
const loginPassforgot = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if ([email, otp].some((field) => field?.trim() === "")) {
    return res
      .status(402)
      .json(
        new ApiError(402, null, "All fields are required")
      )
  }
  try {
    const userdata = await verifyOtp(email, otp);
    if (!userdata) {
      return res
        .status(404)
        .json(
          new ApiError(404, null, "Invalid OTP or OTP verification failed")
        )
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json(
          new ApiError(404, null, "User not found")
        )
    }
    const { accesstoken, refreshtoken } = await genAccessRefreshToken(user._id);

    user.refreshToken = refreshtoken;
    await user.save({ validateBeforeSave: false });
    await sendUserLogedIn(email, user.fullName);

    const redisUserData = {
      age: user.age?.toString() ?? '',
      email: user.email ?? '',
      gender: user.gender ?? '',
      avatar: user.avatar ?? '',
      name: user.fullName ?? '',
    };

    await client.hset(`user:${user._id}`, redisUserData);
    await client.expire(`user:${user._id}`, (process.env.REDIS_DEFAULT_EXPIRY));


    return res
      .status(200)
      .json(
        new ApiResponse(200, { user, accesstoken }, "User logged in successfully")
      )


  } catch (err) {
    return res
      .status(500)
      .json(
        new ApiError(500, err, "server issue")
      )
  }

})

// Api 11 resend otp 
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || email.trim() === "") {
    return res
      .status(402)
      .json(
        new ApiError(402, null, "Email is required")
      )
  }
  const otp = Math.floor(100000 + Math.random() * 900000); // generate a random 6 digit number
  const existedUser = await TemporarySignup.findOneAndUpdate({ email },
    {
      $set: {
        otp: otp,
        otpExpiry: Date.now() + 10 * 60 * 1000 // otp expiry withing 10 minutes
      }
    }
  );
  if (!existedUser) {
    return res
      .status(404)
      .json(
        new ApiError(404, null, "User not found")
      )
  }
  await sendOtp(email, otp);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { success: true }, "Otp has been sent to your email")
    )
})

export {
  regUser,
  ifOtpVerified,
  loginUser,
  userDetails,
  logoutUser,
  genAccessRefreshToken,
  loginpassForgotOtpSend,
  loginPassforgot,
  resendOtp
}