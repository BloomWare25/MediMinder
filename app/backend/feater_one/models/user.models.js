import mongoose, { model } from "mongoose"
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken"

// user should pass all the required fields

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required:[ true , "Email is required"],
        unique: true
    },
    fullName: {
        type: String,
        requied: [true , "Full name is required"] ,
        lowercase: true,
        trim: true
    },
    gender: {
        type: String ,
        required: [true , "Please select your gender"]    
    },
    medical_history:{
        type: [
            {
                type: mongoose.Schema.Types.ObjectId ,
                ref: "Medhistory",
            }
        ]
    },
    medication:{
        type: [
            {
                type: mongoose.Schema.Types.ObjectId ,
                ref: "Medication",
            }
        ]
    },
    password:{
        type: String ,
        required: [true , "passwod is required"]
        
    },
    avatar: { //avatar represents a profile image
        type: String
    },
    refreshToken: {
        type: String
    }
} , {
    timestamps : true
});



// for validation , hashing user's password and generating session tokens 
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) { //checking if the user changes the password or not 
        return next();
    }
    this.password = await bcrypt.hash(this.password, 15); //hashing the user password 
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password) 
}


userSchema.methods.generateAccessToken = async function (){
    return await jwt.sign(
        {
            _id : this._id,
            email : this.email,
            fullName : this.fullName,
            userName : this.userName
        } ,
        process.env.ACCESS_TOKEN_SECRET ,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }        
    )
}
userSchema.methods.generateRefreshToken = async function (){
    return await jwt.sign(
        {
            _id
        },
        process.env.REFRESH_TOKEN_SECRET , 
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User" , userSchema) 