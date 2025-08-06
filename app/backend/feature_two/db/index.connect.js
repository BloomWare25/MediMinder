import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoInstance = await mongoose.connect(`${process.env.MONGODB_URI}/UserDb`)
        console.log(`MongoDB connected: ${mongoInstance.connection.host}`);    
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

export {
    connectDB
}