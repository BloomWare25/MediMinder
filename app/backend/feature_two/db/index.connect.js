import mongoose from "mongoose";
import {asyncHandler} from "../utils/asynchandler.js"

const connectDB = asyncHandler(async () => {
    const mongoInstance = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected: ${mongoInstance.connection.host}`);    
})

export {
    connectDB
}