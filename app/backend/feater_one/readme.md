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