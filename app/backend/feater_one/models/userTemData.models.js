import mongoose from "mongoose";

// email : email ,
//         fullName : fullName ,
//         password : password ,
//         gender : gender ,
//         avatar : avatar
const TemporarySignupSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number ,
        required: true
    },
    otpExpiry: { 
        type: Date,
        required: true 
    },
    userData: {
        fullName : {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        password : {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        },
    }
},) ;

TemporarySignupSchema.index({ "otpExpiry": 1 }, { expireAfterSeconds: 0 });


export const TemporarySignup = mongoose.model("TemporarySignup" , TemporarySignupSchema)