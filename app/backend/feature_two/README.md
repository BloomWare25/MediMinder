# Feature Two: Medication Management API

This module provides RESTful endpoints for storing and retrieving user medication data in a MongoDB database, with Redis caching for optimized reads. It is part of the MediMinder backend.

## Features
- Add a new medication for a user
- Retrieve a user's medication (with Redis cache support)
- JWT-based authentication middleware
- Input validation and error handling

## Folder Structure
```
feature_two/
  app.js
  index.js
  package.json
  controller/
    index.js
  db/
    index.connect.js
    index.redis.js
  middleware/
    authUser.js
  model/
    medication.model.js
  routes/
    medications.routes.js
  utils/
    apiError.js
    apiRes.js
    asynchandler.js
    checkCach.js
```

## How to Use

### 1. Install Dependencies
```sh
npm install
```

### 2. Environment Variables
Create a `.env` file in this folder with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
REDIS_EXPIRY=3600 # (in seconds)
```

### 3. Start the Server
```sh
npm start
```

## API Endpoints

# BaseUrl 
- **URL :** localhost:7800/api/v2

### Add Medication
- **URL:** `/medications`
- **Method:** POST
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Body (form-data or JSON):**
  - `medicineName` (string, required)
  - `dosage` (array of string, required, e.g. `["morning","night"]`)
  - `startDate` (string, required, ISO format: `yyyy-mm-dd`)
  - `endDate` (string, required, ISO format: `yyyy-mm-dd`)
  - `timing` (string, required, "before" or "after")
- **Response:**
  - `200 OK` with medication object on success
  - `400/500` on error

### Get Medication
- **URL:** `/getMed`
- **Method:** GET
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  - `200 OK` with medication object (from cache if available)
  - `404` if no data found

## Middleware
- `authUser`: Verifies JWT token in the `Authorization` header.
- `checkCachedData`: Checks Redis for cached medication data before querying MongoDB.

## Model: Medication
- `userId`: ObjectId (ref: User)
- `medicineName`: String
- `dosage`: Array of String (e.g., ["morning", "night"])
- `startDate`: Date
- `endDate`: Date
- `timing`: String ("before" or "after")

## Example Request (Add Medication)
```json
{
  "medicineName": "Paracetamol",
  "dosage": ["morning", "night"],
  "startDate": "2025-08-01",
  "endDate": "2025-08-10",
  "timing": "after"
}
```

## Author
Debanjan Das

## License
-                                  Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

