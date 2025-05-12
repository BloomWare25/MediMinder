<code>
 __  __ _____ ____ ___ __  __ ___ _   _ ____  _____ ____   
|  \/  | ____|  _ \_ _|  \/  |_ _| \ | |  _ \| ____|  _ \  
| |\/| |  _| | | | | || |\/| || ||  \| | | | |  _| | |_) | 
| |  | | |___| |_| | || |  | || || |\  | |_| | |___|  _ <  
|_|  |_|_____|____/___|_|  |_|___|_| \_|____/|_____|_| \_\

# User Authentication
## Use the API through:
**Base URL:** `http://localhost:5000/api/v1/auth`

### Endpoints:

#### Register User:
**POST** `/register`  
- Description: Create a new user account.  
- Request Body:  
  ```json
  {
    "email": "string",
    "password": "string" ,
    "fullName": "string",
    "gender": "string",
    "avatar": "string"
  }
  ```
- Response Body:
  ```json
    "statusCode": 201,
    "message": "Otp has been sent to the email",
    "success": true
  ```

#### Verify-otp:
**POST** `/verifyotp`  
- Description: Email verification with otp.  
- Request Body:  
  ```json
  {
    "email": "string",
    "otp": "Number"
  }
  ```
- Response Body:
  ```json
    "statusCode": 201,
    "data": {
        "_id": "Mongoose.ObjectId",
        "email": "emailaddress@gmail.com",
        "fullName": "fullName",
        "gender": "Male || female || Others",
        "medical_history": [],
        "medication": [],
        "avatar": "http://res.cloudinary.com/dsz0dpj19/image/upload/someimageUrl",
        "createdAt": "2025-04-26T12:19:15.522Z",
        "updatedAt": "2025-04-26T12:19:15.522Z",
        "__v": 0
    },
    "message": "User has been created successfully",
    "success": true
  ```

#### Login User:
**POST** `/login`  
- Description: Log in an existing user.  
- Request Body:  
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- Response Body:
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
            "refreshtoken": "JWT_REFRESH_TOKEN",
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

#### Logout User:
**POST** `/logout`  
- Description: Log out the currently logged-in user.  
- Request Body:  
  ```json
  {
    "email": "string"
  }
  ```
- Response Body:
  ```json
  {
    "statusCode": 200,
    "message": "User logged out successfully",
    "success": true
  }
  ```

#### Get User Details:
**GET** `/getuserdata`  
- Description: Retrieve details of the currently logged-in user.  
- Headers:  
  ```json
  {
    "Authorization": "Bearer JWT_ACCESS_TOKEN"
  }
  ```
- Response Body:
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

#### Delete Account:
**DELETE** `/deleteacc`  
- Description: Delete the currently logged-in user's account.  
- Headers:  
  ```json
  {
    "Authorization": "Bearer JWT_ACCESS_TOKEN"
  }
  ```
- Response Body:
  ```json
  {
    "statusCode": 200,
    "message": "User account deleted successfully",
    "success": true
  }
  ```