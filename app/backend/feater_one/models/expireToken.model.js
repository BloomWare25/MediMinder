import mongoose from "mongoose";

const expireTokenSchema = new mongoose.Schema(
    {
        refreshToken: {
            type: String ,
            required: true
        } ,
        accessToken: {
            type: String ,
            required: true
        },
        tokenExpiry:{
            type: Date ,
            required: true 
        },
        email: {
            type: String,
            required: true
        }
    } ,
    {timestamps : true}
) ;

expireTokenSchema.index({ "tokenExpiry": 1 }, { expireAfterSeconds: 0 });

const ExpiredToken = mongoose.model("ExpiredToken" , expireTokenSchema) ;


export {
    ExpiredToken
}