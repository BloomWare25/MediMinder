import mongoose from "mongoose";
import { db_name } from "../constants.js"

const connectDb = async () => {
    try{
        const connection_instance = await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`);
        const dbHost =  connection_instance.connection.host ;
        console.log(`MongoDB connected successfully !! db connection host ${dbHost}`);
    }catch(err){
        console.log(`MongoDB connection failure : ${err}`);
        process.exit();
    }
}

export { connectDb }