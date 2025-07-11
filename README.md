<code>
 __  __ _____ ____ ___ __  __ ___ _   _ ____  _____ ____   
|  \/  | ____|  _ \_ _|  \/  |_ _| \ | |  _ \| ____|  _ \  
| |\/| |  _| | | | | || |\/| || ||  \| | | | |  _| | |_) | 
| |  | | |___| |_| | || |  | || || |\  | |_| | |___|  _ <  
|_|  |_|_____|____/___|_|  |_|___|_| \_|____/|_____|_| \_\

# LICENSE 


# DataPrrivacy terms :
- 📢 Data Use Policy

MediMinder and all associated user data (including medical history, medication records, and analytics) are the intellectual property of Bloomware.

The codebase is open source under the Apache 2.0 License. However, **no part of the dataset, collected information, or backend APIs may be used, copied, sold, or redistributed** without **prior written consent from Bloomware**.

Violating this policy may result in legal consequences under data privacy and IP laws.
---

# User Authentication with js
## Authentication with node.js
# MediMinder Auth Service

A secure, scalable authentication and user management backend for the MediMinder application.

---

## Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [Register User](#register-user)
  - [Verify OTP](#verify-otp)
  - [Login User](#login-user)
  - [Logout User](#logout-user)
  - [Get User Details](#get-user-details)
  - [Delete Account](#delete-account)
  - [Update Access & Refresh Token](#update-access--refresh-token)
  - [Update User Password](#update-user-password)
  - [Update User Credentials](#update-user-credentials)
- [Token Security](#token-security)
- [Author](#author)

---

## About

This service provides robust user authentication and management for the MediMinder platform. It supports registration with email verification (OTP), JWT-based login, secure logout with token blacklisting, user profile management, and token rotation for enhanced security.

---

## Tech Stack

- **Node.js** (Express)
- **MongoDB** (Mongoose)
- **Redis** (Upstash)
- **JWT** for authentication
- **Helmet, Compression, Rate Limiting** for security and performance
- **Cloudinary** for avatar uploads

---

## Features

- User registration with OTP email verification
- Secure login with JWT access and refresh tokens
- Token rotation and blacklisting (logout)
- User profile CRUD (update credentials, password, delete account)
- Rate limiting and security headers
- Redis caching for user data

---

## Setup & Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-github-username/mediminder.git
   cd mediminder/app/backend/feater_one
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**  
   Create a `.env` file in this directory with the following (example values):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mediminder
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   REDIS_URI=redis://localhost:6379
   REDIS_TOKEN=your_redis_token
   REDIS_DEFAULT_EXPIRY=3600
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
   ```

4. **Run the server:**
   ```sh
   npm run dev
   ```

---

## Environment Variables

| Name                  | Description                        |
|-----------------------|------------------------------------|
| PORT                  | Server port                        |
| MONGODB_URI           | MongoDB connection string          |
| JWT_SECRET            | JWT access token secret            |
| JWT_REFRESH_SECRET    | JWT refresh token secret           |
| REDIS_URI             | Redis connection URI               |
| REDIS_TOKEN           | Redis access token (Upstash)       |
| REDIS_DEFAULT_EXPIRY  | Redis cache expiry (in seconds)    |
| CLOUDINARY_URL        | Cloudinary config URL              |

---

## API Documentation

**Base URL:** `https://mediminderauth.onrender.com/api/v1/auth`

---

### Register User

**POST** `/register`  
Create a new user account.

- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string",
    "fullName": "string",
    "gender": "string",
    "avatar": "string", // URL or file upload
    "age": "number"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "message": "Otp has been sent to the email",
    "success": true
  }
  ```

---

### Verify OTP

**POST** `/verifyotp`  
Verify email with OTP.

- **Request Body:**
  ```json
  {
    "email": "string",
    "otp": "number"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "data": {
      "_id": "Mongoose.ObjectId",
      "email": "emailaddress@gmail.com",
      "fullName": "fullName",
      "gender": "Male || Female || Others",
      "medical_history": [],
      "medication": [],
      "avatar": "http://res.cloudinary.com/dsz0dpj19/image/upload/someimageUrl",
      "createdAt": "2025-04-26T12:19:15.522Z",
      "updatedAt": "2025-04-26T12:19:15.522Z",
      "__v": 0
    },
    "message": "User has been created successfully",
    "success": true
  }
  ```

---

---

### Resend otp
**POST** `/verifyotp`  
Verify email with OTP.

- **Request Body:**
  ```json
  {
    "email": "string",
    "otp": "number"
  }
  ```
- **Response:**
  ```json
  {
    {
    "statuscode" : 200 ,
    "success": "True" ,
    },
    "message": "Otp has sent to your email",
    "success": true
  }
  ```


---

### Login User

**POST** `/login`  
Log in an existing user.

- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "Mongoose.ObjectId",
        "email": "emailaddress@gmail.com",
        "fullName": "fullName",
        "gender": "Male || Female || Others",
        "medical_history": [],
        "medication": [],
        "avatar": "http://res.cloudinary.com/dsz0dpj19/image/upload/someimageUrl",
        "refreshToken": "JWT_REFRESH_TOKEN",
        "createdAt": "2025-04-26T12:19:15.522Z",
        "updatedAt": "2025-04-26T12:19:15.522Z",
        "__v": 0
      },
      "accesstoken": "JWT_ACCESS_TOKEN"
    },
    "message": "User logged in successfully",
    "success": true
  }
  ```

---

### Forgot Password (Send OTP)

**POST** `/forgot_pass_otp`  
Send OTP to email for otp log in.

- **Request:** `application/json`
  ```json
  {
    "email": "string"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Otp has been sent to the email",
    "success": true
  }
  ```
---

### Forgot Password (Login with OTP)

**POST** `/otp_login`  
Login using OTP sent to email (for otp log in).

- **Request:** `application/json`
  ```json
  {
    "email": "string",
    "otp": "number"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "Mongoose.ObjectId",
        "email": "emailaddress@gmail.com",
        "fullName": "fullName",
        "gender": "Male || Female || Others",
        "medical_history": [],
        "medication": [],
        "avatar": "http://res.cloudinary.com/dsz0dpj19/image/upload/someimageUrl",
        "refreshToken": "JWT_REFRESH_TOKEN",
        "createdAt": "2025-04-26T12:19:15.522Z",
        "updatedAt": "2025-04-26T12:19:15.522Z",
        "__v": 0
      },
      "accesstoken": "JWT_ACCESS_TOKEN"
    },
    "message": "User logged in successfully",
    "success": true
  }
  ```


---


### Logout User

**POST** `/logout`  
Log out the currently logged-in user.

- **Headers:**
  ```
  Authorization: Bearer <JWT_ACCESS_TOKEN>
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "User logged out successfully",
    "success": true
  }
  ```

---

### Get User Details

**GET** `/getuserdata`  
Retrieve details of the currently logged-in user.

- **Headers:**
  ```
  Authorization: Bearer <JWT_ACCESS_TOKEN>
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "Mongoose.ObjectId",
      "email": "emailaddress@gmail.com",
      "fullName": "fullName",
      "gender": "Male || Female || Others",
      "medical_history": [],
      "medication": [],
      "avatar": "http://res.cloudinary.com/dsz0dpj19/image/upload/someimageUrl",
      "createdAt": "2025-04-26T12:19:15.522Z",
      "updatedAt": "2025-04-26T12:19:15.522Z",
      "__v": 0
    },
    "message": "User details retrieved successfully",
    "success": true
  }
  ```

---

### Delete Account

**DELETE** `/deleteacc`  
Delete the currently logged-in user's account.

- **Headers:**
  ```
  Authorization: Bearer <JWT_ACCESS_TOKEN>
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "User account deleted successfully",
    "success": true
  }
  ```

---

### Update Access & Refresh Token

**PATCH** `/refresh/upadate_token`  
Generate new access and refresh tokens using a valid refresh token.

- **Headers:**
  ```
  Authorization: Bearer <JWT_REFRESH_TOKEN>
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "Mongoose.ObjectId",
        "email": "emailaddress@gmail.com",
        "fullName": "fullName",
        "gender": "Male || Female || Others",
        "medical_history": [],
        "medication": [],
        "avatar": "http://res.cloudinary.com/dsz0dpj19/image/upload/someimageUrl",
        "refreshToken": "NEW_JWT_REFRESH_TOKEN",
        "createdAt": "2025-04-26T12:19:15.522Z",
        "updatedAt": "2025-04-26T12:19:15.522Z",
        "__v": 0
      },
      "accesstoken": "NEW_JWT_ACCESS_TOKEN"
    },
    "message": "New Tokens have been generated",
    "success": true
  }
  ```

**Note:**  
Token rotation is used for enhanced security. When the access token expires, the frontend should request a new access token using the refresh token, which will also rotate the refresh token.

---

### Update User Password

**PATCH** `/user/update-password`  
Update the user's password.

- **Headers:**
  ```
  Authorization: Bearer <JWT_ACCESS_TOKEN>
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "oldpassword": "currentPassword",
    "newpassword": "newPassword"
  }
  ```
- **Success Response:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "Mongoose.ObjectId",
      "email": "emailaddress@gmail.com",
      "fullName": "fullName",
      "gender": "Male || Female || Others",
      "medical_history": [],
      "medication": [],
      "avatar": "http://res.cloudinary.com/dsz0dpj19/image/upload/someimageUrl",
      "refreshToken": "JWT_REFRESH_TOKEN",
      "createdAt": "2025-04-26T12:19:15.522Z",
      "updatedAt": "2025-04-26T12:19:15.522Z",
      "__v": 0
    },
    "message": "password has been changed "
  }
  ```
- **Error Response (Incorrect password):**
  ```json
  {
    "statusCode": 303,
    "data": null,
    "message": "Incorrect password!"
  }
  ```

---

### Update User Credentials

**PATCH** `/user/updateuserCred`  
Update the user's profile information (such as full name, gender, age, or avatar).

- **Headers:**
  ```
  Authorization: Bearer <JWT_ACCESS_TOKEN>
  Content-Type: application/json
  ```
- **Request Body** (any of the following fields, as needed):
  ```json
  {
    "fullName": "New Name",
    "gender": "Male || Female || Others",
    "age": 26,
    "avatar": "http://res.cloudinary.com/dsz0dpj19/image/upload/newimageUrl"
  }
  ```
- **Success Response:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "Mongoose.ObjectId",
      "email": "emailaddress@gmail.com",
      "fullName": "New Name",
      "gender": "Male || Female || Others",
      "age": 26,
      "medical_history": [],
      "medication": [],
      "avatar": "http://res.cloudinary.com/dsz0dpj19/image/upload/newimageUrl",
      "refreshToken": "JWT_REFRESH_TOKEN",
      "createdAt": "2025-04-26T12:19:15.522Z",
      "updatedAt": "2025-04-27T10:00:00.000Z",
      "__v": 0
    },
    "message": "User credentials updated successfully"
  }
  ```
- **Error Response (if invalid data or unauthorized):**
  ```json
  {
    "statusCode": 400,
    "data": null,
    "message": "Invalid update data or unauthorized"
  }
  ```

---

## Token Security

- **Access tokens** are short-lived and used for authentication.
- **Refresh tokens** are rotated on use and blacklisted on logout.
- **Blacklisted tokens** are stored in MongoDB with a TTL index for automatic cleanup.
- **Redis** is used for caching user data to improve performance.

---

## Author

[Debanjan](https://github.com/Debanjan2007)

---

> _Feel free to fork, or open issues!_
